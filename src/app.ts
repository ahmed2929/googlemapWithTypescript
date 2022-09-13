import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
  };


const form= document.querySelector('form')! as HTMLFormElement
const addressInput =document.getElementById('address')! as HTMLInputElement

function SearchAddressHandler(event:Event){
    event.preventDefault()
    const enteredAddress = addressInput.value;  
    axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${process.env.GOOGLE_API_KEY}`
    )
    .then(response => {
      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!");
      }
      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 16
      }); 

      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch(err => {
      alert(err.message);
      console.log(err);
    });

}

form.addEventListener('submit',SearchAddressHandler)