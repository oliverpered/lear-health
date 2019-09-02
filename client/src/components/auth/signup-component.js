import _ from 'lodash';
import axios from 'axios';
import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import CryptoJS from 'crypto-js';
import {
  AutoComplete,
  Checkbox,
  DatePicker,
  TimePicker,
  RadioButtonGroup,
  SelectField,
  Slider,
  TextField,
  Toggle
} from 'redux-form-material-ui'


// Components
import PatientSignupForm from '../patient-app/patient-signup.jsx';
import PhysicianSignupForm from '../physician-app/physician-signup.jsx';


const validate = values => {
  const errors = {}
	 if (!values.first) {
    errors.first = 'Please enter your first name'
  }
	 if (!values.last) {
    errors.last = 'Please enter your last name'
  }
  if (!values.email) {
    errors.email = 'Please enter your email'
  }
  if (!values.password) {
    errors.password = 'Password required'
  }
  if (!values.phone) {
    errors.phone = 'Please re-type your password'
  }
  return errors
}

class SignupForm extends Component {

  constructor(props){
    super(props);
		this.state = {
			userType: 'Select'
		}
  }

  static contextTypes = {
      router: React.PropTypes.object
  }

	onSubmit (props) {
    if(this.state.userType === 'Patient') {
      axios.post('/api/patient/signup', props)
      .then( found => {
        //CryptoJS Encoding for user id --> May need to store key in database
        //We can create a random key and add it to props to store in the database above
        //Maybe defeats the purpose though as the key will be stored on the front end here...

        let encodedId = CryptoJS.AES.encrypt(String(found.data), 'key');  //need to change key to actual key 
        localStorage.setItem('uid',encodedId);
        this.context.router.push('/patient/form/background');
      })
      .catch( err => {
          console.log("LOGIN ERROR", err);
      })
    }else if(this.state.userType === 'Provider'){

      axios.post('/api/physician/signup/', props)
      .then( found => {
        let encodedId = CryptoJS.AES.encrypt(String(found.data), 'key');  //need to change key to actual key 
        localStorage.setItem('uid',encodedId);
        this.context.router.push('provider/');
      })
      .catch( err => {
          console.log("LOGIN ERROR", err);
      })
    }  
	}

	handleChange(event) {
		this.setState({ userType: event.target.value })
	}

  renderField ({ input, label, type, meta: { touched, error } }) {
		return(
			<div key={label}>
				<label>{label}</label>
				<input {...input} placeholder={label} type={type} />
				<div className='formErrors'>
					{ touched && error && <span>{error}</span> }
				</div>
			</div>
		)
	}

	render() {
		const { error, handleSubmit, pristine, reset, submitting } = this.props;
				return (
				<div>
					<h2>Sign Up</h2>
					
					<h6>Please select an option below:</h6>
					<form onSubmit={ handleSubmit(props => this.onSubmit(props)) }>
							<select onChange={this.handleChange.bind(this)} value={this.state.userType}>
								<option value="Select">Select...</option>
								<option value="Patient" onChange={this.handleChange}>Patient</option>
								<option value="Provider" onChange={this.handleChange}>Provider</option>
							</select>
              <Field name="first" type="text" component={this.renderField} label="First"/>
              <Field name="last" type="text" component={this.renderField} label="Last"/>
              <Field name="email" type="text" component={this.renderField} label="Email"/>
              <Field name="password" type="password" component={this.renderField} label="Password"/>
              <Field name="reTypePassword" type="password" component={this.renderField} label="Re-Type Password"/>

              {error && <strong>{error}</strong>}
						  <button type='submit' className='btn'>Next</button>
						</form>
				</div>
			)
		}
		
	};

// user types...recorded on application state
export default reduxForm({
	form: 'SignupForm',
	validate
}, null, {  })(SignupForm);