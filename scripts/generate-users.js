#!/usr/bin/env node
const chalk = require('chalk');
const yargs = require('yargs');
const { graphql } = require('./services');
const { times, map, objOf } = require('ramda');

const log = (str) => console.log(`${chalk.yellow('[generate-users]')} ${str}`);

const generateUsers = async ({ baseEmail, count }) => {
  log(`Creating ${count} users...`);

  const [emailInbox, emailDomain] = baseEmail.split('@');
  const emails = times((i) => `${emailInbox}+${i}@${emailDomain}`, count);

  await graphql.graphQL({
    query: /* GraphQL */ `
      mutation CreateUsers($create: [user_insert_input!]!) {
        insert_user(objects: $create) {
          affected_rows
        }
      }
    `,
    variables: {
      create: map(objOf('email'), emails),
    },
  });

  log(`Created ${count} users: ${emails.join(', ')}`);
};

yargs
  .scriptName('generate-users')
  .command(
    '$0 [baseEmail] [count]',
    'Generates user accounts.',
    (yargs) => {
      yargs.positional('baseEmail', {
        type: 'string',
        describe: 'The base email address to use for user generation.',
        default: 'test@test.com',
      }),
        yargs.positional('count', {
          type: 'number',
          describe: 'The number of users to generate',
          default: 1,
        });
    },
    generateUsers
  )
  .help().argv;
