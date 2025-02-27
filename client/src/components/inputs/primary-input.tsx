import React from 'react';
import './inputs.css';

interface Props {
  label: string;
  id: string;
  type: React.HTMLInputTypeAttribute;
  labelClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  required?: boolean;
}

interface State {}

export default class PrimaryInput extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    labelClassName: '',
    inputClassName: '',
    placeholder: '',
    required: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <>
        <label
          htmlFor={this.props.id}
          className={`block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300 ${this.props.labelClassName}`}
        >
          {this.props.label}
        </label>
        <input
          type={this.props.type}
          id={this.props.id}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${this.props.inputClassName}`}
          placeholder={this.props.placeholder}
          required={this.props.required}
        />
      </>
    );
  }
}
