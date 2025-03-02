import React from 'react';
import './buttons.css';

interface Props {
  text?: string;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
  onClick?: () => void;
}

interface State {}

export default class PrimaryButton extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    text: '',
    type: 'button',
    className: '',
    onClick: () => {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <button
        type={this.props.type}
        className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${this.props.className}`}
        onClick={this.props.onClick}
      >
        {this.props.text}
      </button>
    );
  }
}
