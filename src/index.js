import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import {
  ConnectedRouter
} from 'react-router-redux'
import store from './store';
import createHistory from 'history/createHashHistory'
import registerServiceWorker from './registerServiceWorker';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import 'ysynet_reset/men_reset.css';
ReactDOM.render(  
  <Provider store={store}>
    <ConnectedRouter history={createHistory()}>
      <LocaleProvider locale={zh_CN}>
        <App/>
      </LocaleProvider>
    </ConnectedRouter>
  </Provider>, document.getElementById('root'));
registerServiceWorker();
