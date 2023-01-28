import React from 'react'
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import md5 from 'md5'
import firebase from '../../firebase'

export default function Register() {
  const initialState = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  }

  const [registerUserState, setRegisterUserState] = React.useState(initialState)
  const [errors, setErrors] = React.useState([])
  const [status, setStatus] = React.useState('')
  const [userRef] = React.useState(firebase.database().ref('/users'))

  const handleChange = event => {
    setRegisterUserState({
      ...registerUserState,
      [event.target.name]: event.target.value,
    })
  }

  const formIsValid = () => {
    let errors = []
    let error
    if (isFormEmpty(registerUserState)) {
      error = { message: '모든 항목을 채워주세요.' }
      setErrors(errors.concat(error))
      return false
    } else if (!isPasswordValid(registerUserState)) {
      error = { message: '비밀번호가 일치하지 않습니다.' }
      setErrors(errors.concat(error))
      return false
    } else {
      return true
    }
  }

  const isFormEmpty = ({ userName, email, password, confirmPassword }) => {
    return !userName || !email || !password || !confirmPassword
  }

  const isPasswordValid = ({ password, confirmPassword }) => {
    if (password.length < 6 || confirmPassword.length < 6) {
      return false
    } else if (password !== confirmPassword) {
      return false
    } else {
      return true
    }
  }

  const onSubmit = async event => {
    event.preventDefault()
    if (formIsValid()) {
      const { email, password } = registerUserState
      const errors = []
      setErrors(errors)
      setStatus('PENDING')
      try {
        const createdUser = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)

        try {
          await createdUser.user.updateProfile({
            displayName: userName,
            photoURL: `https://www.gravatar.com/avatar/${md5(
              createdUser.user.email
            )}?d=identicon`,
          })
          await saveUser(createdUser)
          setStatus('RESOLVED')
        } catch (err) {
          setStatus('RESOLVED')
          setErrors(errors.concat({ message: err.message }))
        }
      } catch (err) {
        setStatus('RESOLVED')
        setErrors(errors.concat({ message: err.message }))
      }
    }
  }

  const saveUser = createdUser =>
    userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      photoUrl: createdUser.user.photoURL,
    })

  const handleInputError = (errors, inputName) => {
    return errors.some(err =>
      err.message.toLowerCase().includes(inputName.toLowerCase())
    )
      ? 'error'
      : ''
  }

  const { userName, email, password, confirmPassword } = registerUserState

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="blue" textAlign="center">
          <Icon name="slack"/>
          Register for poslack!!
        </Header>
        <Form size="large" onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input
              fluid
              type="text"
              name="userName"
              icon="user"
              iconPosition="left"
              placeholder="이름"
              value={userName}
              onChange={handleChange}
              className={handleInputError(errors, 'userName')}
            />
            <Form.Input
              fluid
              type="email"
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="이메일"
              value={email}
              onChange={handleChange}
              className={handleInputError(errors, 'email')}
            />
            <Form.Input
              fluid
              type="password"
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="비밀번호"
              value={password}
              onChange={handleChange}
              className={handleInputError(errors, 'password')}
            />
            <Form.Input
              fluid
              type="password"
              name="confirmPassword"
              icon="redo"
              iconPosition="left"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleChange}
              className={handleInputError(errors, 'password')}
            />
            <Button
              disabled={status === 'PENDING'}
              className={status === 'PENDING' ? 'loading' : ''}
              type="submit"
              fluid
              color="blue"
              size="large"
            >
              회원가입
            </Button>
          </Segment>
        </Form>
        {errors.length > 0 &&
          errors.map((err, i) => (
            <Message error key={i}>
              <p>{err.message}</p>
            </Message>
          ))}
        <Message>
          Already have an account? <Link to="/login">Login</Link>{' '}
        </Message>
      </Grid.Column>
    </Grid>
  )
}
