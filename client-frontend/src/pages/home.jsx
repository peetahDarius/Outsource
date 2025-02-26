import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { FingerPrintIcon, UsersIcon } from "@heroicons/react/24/solid";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";
import Technician from "../media/technician.jpg"
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GiCheckMark } from "react-icons/gi";

export function Home() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] =  useState("")
  const [email, setEmail] = useState("")
  const [longitude, setLongitude] = useState("")
  const [latitude, setLatitude] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };
  
  const center = {
    lat: -1.286389, // Default to Nairobi, Kenya
    lng: 36.817223,
  };

  const handleMapClick = (event) => {
    setLatitude(event.latLng.lat());
    setLongitude(event.latLng.lng());
  };

  const sendData = async (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)
    const data = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      longitude: longitude,
      latitude: latitude,
      message: message,
    };
    const url = "http://127.0.0.1:5001/clients/";
    try {
      const response = await axios.post(url, JSON.stringify(data), {
        headers : {
          "Content-Type": "application/json"
        }
      });
      console.log(response.data);
      setSubmitted(true); // Set submission status to true on success
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-3.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h1"
                color="white"
                className="mb-6 font-black"
              >
               Your trusted partner in network installation.
              </Typography>
              <Typography variant="lead" color="white" className="opacity-80">
              We design and install networks tailored to your specific needs, whether it’s for a small office or a large enterprise.
              From routers and switches to firewalls and Wi-Fi extenders, we set up all the essential components for seamless connectivity
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="-mt-32 bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <FeatureCard
                key={title}
                color={color}
                title={title}
                icon={React.createElement(icon, {
                  className: "w-5 h-5 text-white",
                })}
                description={description}
              />
            ))}
          </div>
          <div className="mt-32 flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg">
                <FingerPrintIcon className="h-8 w-8 text-white " />
              </div>
              <Typography
                variant="h3"
                className="mb-3 font-bold"
                color="blue-gray"
              >
                Working with us is a pleasure
              </Typography>
              <Typography className="mb-8 font-normal text-blue-gray-500">
              We believe that a reliable network is the backbone of any successful business. Our mission is to provide high-quality services that empower our clients to focus on what they do best. Whether you need a brand-new setup, regular maintenance, or urgent repairs, our team is here to ensure your network is robust, secure, and optimized for performance.
                <br />
                <br />
                Our team of certified network technicians brings years of hands-on expertise.
              </Typography>
              <Button variant="filled">read more</Button>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                <CardHeader floated={false} className="relative h-56">
                  <img
                    alt="Card Image"
                    src={Technician}
                    className="h-full w-full"
                  />
                </CardHeader>
                <CardBody>
                  <Typography variant="small" color="blue-gray" className="font-normal">Enterprise</Typography>
                  <Typography
                    variant="h5"
                    color="blue-gray"
                    className="mb-3 mt-2 font-bold"
                  >
                    Top Notch Services
                  </Typography>
                  <Typography className="font-normal text-blue-gray-500">
                    The Arctic Ocean freezes every winter and much of the
                    sea-ice then thaws every summer, and that process will
                    continue whatever happens.
                  </Typography>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <section className="px-4 pt-15 pb-10">
        <div className="container mx-auto">
          <PageTitle section="" heading="Consultation & Assessment">
          We start by listening to your challenges and objectives. Our team conducts a thorough assessment of your current network setup to identify vulnerabilities and opportunities for enhancement.
          </PageTitle>
        </div>
      </section>
      <section className="px-4 pt-20 pb-10">
        <div className="container mx-auto">
          <PageTitle section="" heading="Custom Planning & Design">
          Based on the assessment, we design a network architecture that balances performance, scalability, and security. Every solution is customized to meet your business’s short- and long-term goals.
          </PageTitle>
        </div>
      </section>
      <section className="relative bg-white py-20 px-4">
        <div className="container mx-auto">
          <PageTitle section="" heading="Seamless Installation & Implementation">
          Our certified technicians handle every aspect of the installation—from hardware setup to software configuration—minimizing downtime and ensuring a smooth transition.
          </PageTitle>
          <div className="mx-auto mt-20 mb-48 grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
              <Card
                key={title}
                color="transparent"
                shadow={false}
                className="text-center text-blue-gray-900"
              >
                <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                  {React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                </div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {title}
                </Typography>
                <Typography className="font-normal text-blue-gray-500">
                  {description}
                </Typography>
              </Card>
            ))}
          </div>
          <PageTitle section="Contact Us" heading="Want to work with us?">
            Complete this form and we will get back to you in 24 hours.
          </PageTitle>
          <form
            onSubmit={sendData}
            className="mx-auto w-full mt-12 lg:w-10/12"
          >
            {submitted ? (
              // Display this message after successful submission
              <Typography variant="h5" className="text-center">
  <div className="flex items-center justify-center gap-2">
  <GiCheckMark color="green" />
    <span>Message sent. We'll get back to you in 24 hrs.</span>
  </div>
</Typography>

            ) : (
              <div className="container mx-auto p-6">
                <h2 className="text-xl font-bold mb-4">Select Your Location</h2>
                {/* Google Maps Integration */}
                <LoadScript googleMapsApiKey="AIzaSyBKFaZIQyDRmUTlYlapAB827_0xvA6_u24">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={10}
                    center={center}
                    onClick={handleMapClick}
                  >
                    {latitude && longitude && (
                      <Marker position={{ lat: latitude, lng: longitude }} />
                    )}
                  </GoogleMap>
                </LoadScript>

                {/* Input Fields */}
                <div className="mt-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    variant="outlined"
                    size="lg"
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    variant="outlined"
                    size="lg"
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  <Input
                    variant="outlined"
                    size="lg"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    variant="outlined"
                    size="lg"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Input
                    variant="outlined"
                    size="lg"
                    label="Latitude"
                    value={latitude}
                    readOnly
                    required
                  />
                  <Input
                    variant="outlined"
                    size="lg"
                    label="Longitude"
                    value={longitude}
                    readOnly
                    required
                  />
                </div>
                <Textarea
                  variant="outlined"
                  size="lg"
                  label={
                    <span>
                      Message<span className="text-red-500">*</span>
                    </span>
                  }
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                {/* Submit Button */}
                <Button
                  variant="gradient"
                  size="lg"
                  type="submit"
                  className="mt-6"
                  fullWidth
                >
                  Send Message
                </Button>
              </div>
            )}
          </form>
        </div>
      </section>
      <div className="bg-white">
        <Footer />
      </div>
    </>
  );
}

export default Home;
