import React, { Component } from 'react'
import JSONEditor from '../jsoneditor/index.react'
import { setIn } from '../jsoneditor/utils/immutabilityHelpers'
import { largeJson } from './resources/largeJson'

import './Demo.css'

const schema = {
  "title": "Example Schema",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "gender": {
      "enum": ["male", "female"]
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    }
  },
  "required": ["firstName", "lastName"]
}

const json = {
  'array': [1, 2, 3],
  'emptyArray': [],
  'emptyObject': {},
  'firstName': null,
  'boolean': true,
  'null': null,
  'number': 123,
  'object': {'a': 'b', 'c': 'd', 'e': [{"first": true}, {"second": true}]},
  'string': 'Hello World',
  'unicode': 'A unicode character: \u260E',
  'url': 'http://jsoneditoronline.org'
}

function expandAll (path) {
  return true
}

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      logging: false,

      options: {
        json,
        schema: null,

        name: 'myObject',
        onPatch: this.handlePatch,
        onPatchText: this.handlePatchText,
        onChange: this.handleChange,
        onChangeText: this.handleChangeText,
        onChangeMode: this.handleChangeMode,
        onError: this.handleError,
        mode: 'tree',
        modes: ['text', 'code', 'tree', 'form', 'view'],
        keyBindings: {
          compact: ['Ctrl+\\', 'Command+\\', 'Ctrl+Alt+1', 'Command+Option+1'],
          format: ['Ctrl+Shift+\\', 'Command+Shift+\\', 'Ctrl+Alt+2', 'Command+Option+2'],
          duplicate: ['Ctrl+D', 'Ctrl+Shift+D', 'Command+D', 'Command+Shift+D']
        },
        indentation: 4,
        escapeUnicode: true,
        history: true,
        search: true,

        expand: expandAll
      }
    }

  }
  render() {
    return <div className="demo">
      <div className="menu">
        <button onClick={this.handleSetJson}>Set JSON</button>
        <button onClick={this.handleGetJson}>Get JSON</button>

        <label>mode:
          <select value={this.state.options.mode} onChange={this.handleSetMode}>
            <option value="text">text</option>
            <option value="code">code</option>
            <option value="tree">tree</option>
            <option value="form">form</option>
            <option value="view">view</option>
          </select>
        </label>

        <label>
          <input type="checkbox"
                 value={this.state.options.schema !== null}
                 onChange={this.handleToggleJSONSchema} /> JSON Schema
        </label>

        <label>
          <input type="checkbox"
                 value={this.state.logging}
                 onChange={this.handleToggleLogging} /> Log events
        </label>
      </div>
      <div className="contents">
        <JSONEditor {...this.state.options} />
      </div>
    </div>
  }

  handleSetJson = () => {
    this.setState({
      options: setIn(this.state.options, ['json'], largeJson)
    })
  }

  handleGetJson = () => {
    // FIXME: get updating json in the state working
    const json = this.state.options.json
    alert(JSON.stringify(json, null, 2))
  }

  handleSetMode = (event) => {
    const mode = event.target.value
    this.setState({
      options: setIn(this.state.options, ['mode'], mode)
    })
  }

  handleToggleLogging = (event) => {
    const logging = event.target.checked
    this.setState({ logging })
  }

  handleToggleJSONSchema = (event) => {
    const s = event.target.checked ? schema : null
    this.setState({
      options: setIn(this.state.options, ['schema'], s)
    })
  }

  handleChange = (json) => {
    this.log('onChange json=', json)
    // FIXME: update the json in the state (after JSONEditor neatly updates it instead of generating new json every time
    // this.setState({
    //   options: setIn(this.state.options, ['json'], json)
    // })
  }

  handleChangeText = (text) => {
    this.log('onChangeText', text)
  }

  handlePatch = (patch, revert) => {
    this.log('onPatch patch=', patch, ', revert=', revert)
    window.patch = patch
    window.revert = revert
  }

  handlePatchText = (patch, revert) => {
    // FIXME: implement onPatchText
    this.log('onPatchText patch=', patch, ', revert=', revert)
  }

  handleChangeMode = (mode, prevMode) => {
    this.log('switched mode from', prevMode, 'to', mode)

    this.setState({
      options: setIn(this.state.options, ['mode'], mode)
    })
  }

  handleError = (err) => {
    console.error(err)
    alert(err)
  }

  log (...args) {
    if (this.state.logging) {
      console.log(...args)
    }
  }
}

export default App
