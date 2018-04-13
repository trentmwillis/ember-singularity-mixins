import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import registerPolyfills from './helpers/polyfills/register';

registerPolyfills();
setApplication(Application.create(config.APP));

start();
