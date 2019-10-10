import App from './App.svelte';
import Amplify from '@aws-amplify/core';
import PubSub from '@aws-amplify/pubsub';
import aws_exports from './aws-exports';
import './main.css';
//import 'core-js/stable';
import 'regenerator-runtime/runtime';

if ('serviceWorker' in navigator) {
  // sw.js can literally be empty, but must exist
  navigator.serviceWorker.register('/sw.js');
}

Amplify.configure(aws_exports);
PubSub.configure(aws_exports);

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

export default app;
