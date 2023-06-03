import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onLoginPressed = async (e) => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    const headerOptions = new Headers()
    headerOptions.append(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=UTF-8'
    )
    headerOptions.append('Accept', 'application/json')
    headerOptions.append(
      'Access-Control-Allow-Origin',
      'http://localhost:19006'
    )
    headerOptions.append('Access-Control-Allow-Credentials', 'true')
    headerOptions.append('GET', 'POST', 'OPTIONS')
    const dataToSend = {
      Email: email.value,
      Password: password.value,
      returnUrl: 'http://localhost:19006/',
    }
    let formBody = []
    for (const key in dataToSend) {
      if (Object.hasOwn(dataToSend, key)) {
        const encodedKey = encodeURIComponent(key)
        const encodedValue = encodeURIComponent(dataToSend[key])
        formBody.push(encodedKey + '=' + encodedValue)
      }
    }

    formBody = formBody.join('&')
    e.preventDefault()
    const requestOptions = {
      method: 'POST',
      headers: headerOptions,
      body: formBody,
    }

    const response = await fetch(
      'http://localhost:5226/Account/login',
      requestOptions
    )
    try{
      const data = await response.json()
      if (data !== null && data.success === 'SUCCESS') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Mailbox' }],
        })
      }
      else{
        <Alert />
      }
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
