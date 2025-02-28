import React from 'react';
import './selects.css';

interface Props {
  label: string;
  categories: readonly string[];
  labelClassName?: string;
  selectClassName?: string;
  optionClassName?: string;
  placeholder?: string;
  onSelect?: (currentCategory: string) => void;
}

interface State {
  currentCategory: string;
}

export default class PrimarySelect extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    labelClassName: '',
    selectClassName: '',
    optionClassName: '',
    placeholder: 'Select One',
    onSelect: (currentCategory: string) => {},
  };

  constructor(props: Props) {
    super(props);

    if (this.props.placeholder === undefined) throw new Error('Unreachable');
    this.state = {
      currentCategory: this.props.placeholder,
    };
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
          onSelect={() => {
            if (this.props.onSelect === undefined)
              throw new Error('Unreachable');
            this.props.onSelect(this.state.currentCategory);
          }}
        >
          <option
            selected={this.props.optionClassName === this.state.currentCategory}
            className={`${this.props.optionClassName}`}
          >
            {this.props.placeholder}
          </option>
          {this.props.categories.map((category) => (
            <option
              selected={category === this.state.currentCategory}
              className={`${this.props.optionClassName}`}
            >
              {/* Capitalize first letter */}
              {category[0].toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </>
    );
  }
}
