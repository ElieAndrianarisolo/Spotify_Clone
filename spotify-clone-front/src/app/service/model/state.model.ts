// Enum-like type for status notifications
export type StatusNotification = 'OK' | 'ERROR' | 'INIT';

// Class representing a state with a value, error, and status
export class State<T, V> {
  // Optional value of type T
  value?: T;
  // Optional error of type V
  error?: V;
  // Status of the state
  status: StatusNotification;

  // Constructor to initialize the state
  constructor(status: StatusNotification, value?: T, error?: V) {
    this.value = value;
    this.error = error;
    this.status = status;
  }

  // Static method to create a StateBuilder instance for fluent construction
  static Builder<T, V>() {
    return new StateBuilder<T, V>();
  }
}

// Builder class for creating State instances in a fluent manner
class StateBuilder<T, V> {
  // Initial status set to 'INIT'
  private status: StatusNotification = 'INIT';
  // Optional value of type T
  private value?: T;
  // Optional error of type V
  private error?: V;

  // Method to set the state for an error scenario
  public forError(error: any): StateBuilder<T, V> {
    this.error = error;
    this.status = 'ERROR';
    return this;
  }

  // Method to set the state for a successful scenario
  public forSuccess(value: T): StateBuilder<T, V> {
    this.value = value;
    this.status = 'OK';
    return this;
  }

  // Method to set the state to 'INIT'
  public forInit(): StateBuilder<T, V> {
    this.status = 'INIT';
    return this;
  }

  // Method to build and return a State instance based on the current builder state
  build(): State<T, V> {
    return new State<T, V>(this.status, this.value, this.error);
  }
}
