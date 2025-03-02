import React from 'react';
import './inputs.css';

interface Props {
  id: string;
  label?: string;
  type: React.HTMLInputTypeAttribute;
  labelClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  required?: boolean;
}

interface State {}

export default class PrimaryInput extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    label: '',
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
      <div className={this.props.type === 'checkbox' ? 'flex flex-row' : ''}>
        {this.props.label !== '' && (
          <label
            htmlFor={this.props.id}
            className={`block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300 ${this.props.labelClassName}`}
          >
            {this.props.label}
          </label>
        )}
        <input
          type={this.props.type}
          id={this.props.id}
          className={
            this.props.type === 'checkbox'
              ? `my-auto ${this.props.label !== '' ? 'ml-3' : ''} w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${this.props.inputClassName}`
              : `bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${this.props.inputClassName}`
          }
          placeholder={this.props.placeholder}
          required={this.props.required}
        />
      </div>
    );
  }
}
