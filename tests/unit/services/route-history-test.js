/**
 * Route History Service Unit Test
 */

import EmberObject from '@ember/object';

import { A } from '@ember/array';

import { module, test } from 'qunit';

import { setupTest } from 'ember-qunit';

module('Unit - Service - Route History Service', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.setup = function () {
		this.owner.lookup('service:route-history').set('history', A());
	};

    this.teardown = function () {
	};
  });


  test('Service add a route to the history', function (assert) {
      assert.expect(2);
      const subject = this.owner.lookup('service:route-history');

      assert.ok(subject.get('history.length') === 0, 'History is empty by default');

      subject.addRouteToHistory('posts');
      subject.addRouteToHistory('comments');

      assert.ok(subject.get('history.length') === 2, 'History has 2 entries after adding 2 routes');

  });

  test('Service set the current route properly', function (assert) {
      assert.expect(3);

      const subject = this.owner.lookup('service:route-history');
      const route = EmberObject.create({});

      route.set('routeName', 'loading');
      subject.setCurrentRoute(route);

      assert.ok(subject.get('current') === '', 'The service doesn\'t keep track of the loading route');

      route.set('routeName', 'posts');
      subject.setCurrentRoute(route);

      assert.ok(subject.get('current') === 'posts', 'The current route is now set to "post"');
      assert.ok(subject.get('history.length') === 1, 'History has 1 entry after setting the current route to "post"');
  });

  test('Service can load previous route properly', function (assert) {
      assert.expect(3);

      const subject = this.owner.lookup('service:route-history');
      const route = EmberObject.create({});

      route.set('routeName', 'firstRoute');
      subject.setCurrentRoute(route);
      assert.ok(subject.get('previous') === null, 'The previous route does not exist.');

      route.set('routeName', 'secondRoute');
      subject.setCurrentRoute(route);
      assert.ok(subject.get('previous') === 'firstRoute', 'The previous route is "firstRoute"');

      route.set('routeName', 'thirdRoute');
      subject.setCurrentRoute(route);
      assert.ok(subject.get('previous') === 'secondRoute', 'The previous route is "secondRoute"');
  });

  test('Service doesn\'t go higher than the maxLength', function (assert) {
      assert.expect(2);

      const subject = this.owner.lookup('service:route-history');
      const route = EmberObject.create({});

      subject.set('maxHistoryLength', 2);

      route.set('routeName', 'posts');
      subject.setCurrentRoute(route);
      route.set('routeName', 'comments');
      subject.setCurrentRoute(route);
      route.set('routeName', 'accounts');
      subject.setCurrentRoute(route);
      route.set('routeName', 'home');
      subject.setCurrentRoute(route);

      const history = subject.get('history');

      assert.ok(history.get('length') === 2, 'History has 2 entries after adding 4 routes');
      assert.ok(history.objectAt(0) === 'accounts' && history.objectAt(1) === 'home', 'History is properly saved');
  });
});
