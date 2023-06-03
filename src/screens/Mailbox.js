import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import BackButton from '../components/BackButton'

export default function Mailbox({ navigation }) {
  const [location, setLocation] = useState({});
  const [address, setAddress] = useState();

  Location.setGoogleApiKey("AIzaSyCYPyGotbPJAcE9Ap_ATSKkKOrXCQC4ops");

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }
      else {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        console.log("Location:");
        console.log(currentLocation);
      }
    };
    getPermissions();
  }, []);

  const geocode = async () => {
    const currentLocation = await Location.geocodeAsync(address);
    console.log("Current Location:");
    console.log(currentLocation);
    setLocation(currentLocation);
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Current location</Header>
      <Paragraph>
      Longitude: { location && location.coords && location.coords.longitude  }
      </Paragraph>
      <Paragraph>
      Latitude: { location && location.coords && location.coords.latitude  }
      </Paragraph>

      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'StartScreen' }],
          })
        }
      >
        Logout
      </Button>
    </Background>
  )
}
