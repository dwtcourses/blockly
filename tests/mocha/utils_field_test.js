/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2019 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Tests for Blockly.utils.fields
 * @author bekawestberg@gmail.com (Beka WEstberg)
 */
'use strict';

suite('Field Utils', function() {
  function CustomFieldType(value) {
    CustomFieldType.superClass_.constructor.call(this, value);
  }
  goog.inherits(CustomFieldType, Blockly.Field);
  CustomFieldType.fromJson = function(options) {
    return new CustomFieldType(options['value']);
  };

  teardown(function() {
    if (Blockly.utils.fields.typeMap_['field_custom_test']) {
      delete Blockly.utils.fields.typeMap_['field_custom_test'];
    }
  });
  suite('Registration', function() {
    test('Simple', function() {
      Blockly.utils.fields.register('field_custom_test', CustomFieldType);
    });
    test('Empty String Key', function() {
      chai.assert.throws(function() {
        Blockly.utils.fields.register('', CustomFieldType);
      }.bind(this), 'Invalid field type');
    });
    test('Class as Key', function() {
      chai.assert.throws(function() {
        Blockly.utils.fields.register(CustomFieldType, '');
      }.bind(this), 'Invalid field type');
    });
    test('fromJson as Key', function() {
      chai.assert.throws(function() {
        Blockly.utils.fields.register(CustomFieldType.fromJson, '');
      }.bind(this), 'Invalid field type');
    });
    // TODO (#2788): What do you want it to do if you overwrite a key?
    test('Overwrite a Key', function() {
      Blockly.utils.fields.register('field_custom_test', CustomFieldType);

      Blockly.utils.fields.register('field_custom_test', CustomFieldType);
    });
    test('Null Value', function() {
      chai.assert.throws(function() {
        Blockly.utils.fields.register('field_custom_test', null);
      }.bind(this), 'fromJson function');
    });
    test('No fromJson', function() {
      var fromJson = CustomFieldType.fromJson;
      delete CustomFieldType.fromJson;
      chai.assert.throws(function() {
        Blockly.utils.fields.register('field_custom_test', CustomFieldType);
      }.bind(this), 'fromJson function');
      CustomFieldType.fromJson = fromJson;
    });
    test('fromJson not a function', function() {
      var fromJson = CustomFieldType.fromJson;
      CustomFieldType.fromJson = true;
      chai.assert.throws(function() {
        Blockly.utils.fields.register('field_custom_test', CustomFieldType);
      }.bind(this), 'fromJson function');
      CustomFieldType.fromJson = fromJson;
    });
  });
  suite('Retrieval', function() {
    test('Simple', function() {
      Blockly.utils.fields.register('field_custom_test', CustomFieldType);

      var json = {
        type: 'field_custom_test',
        value: 'ok'
      };

      var field = Blockly.utils.fields.fromJson(json);
      chai.assert.isNotNull(field);
      chai.assert.equal('ok', field.getValue());
    });
    test('Not Registered', function() {
      var json = {
        type: 'field_custom_test',
        value: 'ok'
      };

      var spy = sinon.stub(console, 'warn');
      var field = Blockly.utils.fields.fromJson(json);
      chai.assert.isNull(field);
      chai.assert.isTrue(spy.called);
      spy.restore();
    });
    // TODO: Is this supposed to be case sensitive?
    test.skip('Case Different', function() {
      Blockly.utils.fields.register('field_custom_test', CustomFieldType);

      var json = {
        type: 'FIELD_CUSTOM_TEST',
        value: 'ok'
      };

      var field = Blockly.utils.fields.fromJson(json);
      chai.assert.isNotNull(field);
      chai.assert.equal('ok', field.getValue());
    });
  });
});
