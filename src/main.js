import App from './App.svelte';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import './main.css';

Amplify.configure(aws_exports);

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

export default app;
