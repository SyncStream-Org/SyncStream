import React from 'react';
import './selects.css';

interface Props {
  label: string;
  categories: readonly string[];
  defaultCategory: string;
  labelClassName?: string;
  selectClassName?: string;
  optionClassName?: string;
  onChange?: (currentCategory: string) => void;
}

interface State {}

export default class PrimarySelect extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    labelClassName: '',
    selectClassName: '',
    optionClassName: '',
    onChange: (currentCategory: string) => {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <>
        <p
          className={`block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300 ${this.props.labelClassName}`}
        >
          {this.props.label}
        </p>
        <select
          className={`py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${this.props.selectClassName}`}
          onChange={(event) => {
            if (this.props.onChange === undefined)
              throw new Error('Unreachable');

            if (
              !this.props.categories.includes(this.props.defaultCategory) &&
              this.props.defaultCategory === event.target.value
            )
              return;

            this.props.onChange(event.target.value);
          }}
          defaultValue={this.props.defaultCategory}
        >
          {/* Add default category as placeholder if it doesn't exist */}
          {!this.props.categories.includes(this.props.defaultCategory) && (
            <option
              key={this.props.defaultCategory}
              className={`${this.props.optionClassName}`}
            >
              {this.props.defaultCategory}
            </option>
          )}

          {this.props.categories.map((category) => (
            <option key={category} className={`${this.props.optionClassName}`}>
              {category}
            </option>
          ))}
        </select>
      </>
    );
  }
}
