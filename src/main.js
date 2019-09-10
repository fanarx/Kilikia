import App from './App.svelte';
import Amplify from '@aws-amplify/core';
import PubSub from '@aws-amplify/pubsub';
import aws_exports from './aws-exports';
import './main.css';
//import 'core-js/stable';
import 'regenerator-runtime/runtime';

Amplify.configure(aws_exports);
PubSub.configure(aws_exports);

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

export default app;
