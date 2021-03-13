import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { store } from './store';
import Main from '~/applications/Main';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import client from '~/util/client';

if (module.hot) {
  module.hot.accept();
}

const theme = createMuiTheme({
  typography: {
    fontSize: 12,
  },
  palette: {
    type: 'light',
    background: {
      primary: '#d0d0d6',
    },
    primary: {
      main: '#c5e1a5',
    },
    secondary: {
      main: '#a1887f',
    },
    // text: {
    //   link: {
    //     primary: '#8cb1d9',
    //     hover: '#b3cbe6',
    //   },
    // },
  },
});

document.body.style.margin = '0px';
document.body.style.backgroundColor = theme.palette.background.primary;

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <ApolloProvider client={client}>
            <BrowserRouter>
              <Main />
            </BrowserRouter>
          </ApolloProvider>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
