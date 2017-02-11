/** @jsx createElement */
import { Component, createElement } from "react";

const emptyChar = "\u00a0";

class Typer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      line: 0,
      cursor: 0,
      buffer: this.props.end ? this.props.text[this.props.text.length - 1].split("") : [emptyChar],
      isNew: true
    };
  }

  writeNext() {
    const {
      text,
      loop,
      timeLine,
      timeChar,
      timeLoop
    } = this.props;
    const { state } = this;
    if (state.line < text.length && state.cursor < text[state.line].length) {
      var line = text[state.line];
      var newState = { ...state };

      if (state.isNew) {
        newState.buffer = [text[state.line].charAt((newState.cursor++))];
        newState.isNew = false;
      } else {
        newState.buffer = [...state.buffer, text[state.line].charAt((newState.cursor++))];
      }

      this.setState(newState, state => {
        if (
          newState.cursor == text[newState.line].length //next is new line
        ) {
          this.timeout = setTimeout(() => this.writeNext(), text[newState.line].length * timeLine);
        } else {
          this.timeout = setTimeout(() => this.writeNext(), timeChar + Math.random() * 50);
        }
      });
    } else if (state.line + 1 < text.length && state.cursor == text[state.line].length) {
      this.setState(
        state => {
          var newState = {
            ...state
          };
          newState.cursor = 0;
          newState.buffer = [emptyChar];
          newState.isNew = true;
          newState.line++;
          return newState;
        },
        () => {
          this.timeout = setTimeout(() => this.writeNext(), timeChar * 2);
        }
      );
    } else if (this.props.loop) {
      this.timeout = setTimeout(
        () => {
          this.setState(
            {
              line: 0,
              cursor: 0,
              buffer: [emptyChar],
              isNew: true
            },
            () => {
              this.writeNext();
            }
          );
        },
        timeLoop
      );
    } else {
      if (this.props.onEnd) this.props.onEnd();
    }
  }

  componentDidMount() {
    if (!this.props.end) this.timeout = setTimeout(() => this.writeNext(), this.props.timeInitial);
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  render() {
    const propsChild = { className: this.props.className };
    return <span {...propsChild}>{this.state.buffer.join("")}</span>;
  }
}

Typer.defaultProps = {
  loop: false,
  timeLine: 150,
  timeChar: 10,
  timeLoop: 1000,
  timeInitial: 500,
  text: ["text", "second"],
  end: false
};

module.exports = Typer;
