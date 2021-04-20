import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';

// SCALAR_MAP :: Map<String, GraphQLScalar>
export const SCALAR_MAP = {
  ID: GraphQLID,
  Int: GraphQLInt,
  Float: GraphQLFloat,
  Boolean: GraphQLBoolean,
  String: GraphQLString,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};
