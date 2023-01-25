import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconBookmark,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import {
  Image,
  Button,
  Title,
  Text,
  Group,
  Spoiler,
  Indicator,
  Modal,
  useMantineTheme,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { DatePicker, DateRangePicker } from "@mantine/dates";
function CarDetail() {
  const [car, setCar] = useState([]);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [opened, setOpened] = useState(false);
  const [bookmarkedCarList, setBookmarkedCarList] = useState([]);
  const theme = useMantineTheme();

  useEffect(() => {
    axios
      .get("https://mocki.io/v1/4f7bf80f-e4c8-44c5-9be2-afc649a5af96")
      .then((response) => {
        setCar(response.data.cars);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const updateDate = (date, id) => {
    setBooking((preValue) => {
      return [
        ...preValue,
        {
          id: id,
          date: date,
        },
      ];
    });

    const filtedCar = car.filter((item) => item.id === id);
    console.log(filtedCar[0]);
    setBookmarkedCarList((preValue) => {
      return [
        ...preValue,
        {
          id: id,
          carName: filtedCar[0].carName,
          image: filtedCar[0].images,
          carPrice: filtedCar[0].carPrice,
          detail: filtedCar[0].detail,
        },
      ];
    });
  };

  const removeHandeler = (id) => {
    const filtedCar = bookmarkedCarList.filter((item) => item.id !== id);
    console.log(filtedCar);
    setBookmarkedCarList(filtedCar)

  };

  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }

  if (!car) {
    return <p>Please Wait while its Loading...</p>;
  }

  const slides = (src) => {
    return src.images.map((url) => (
      <Carousel.Slide key={url}>
        <Image src={url} className="w-full mx-2" />
      </Carousel.Slide>
    ));
  };

  return (
    <div className="font-poppins">
      <nav className="flex justify-between p-4 items-center bg-slate-500 text-white">
        <div>
          <h1>Cars</h1>
        </div>
        <div className="cursor-pointer p-2">
          <Indicator
            label={bookmarkedCarList.length}
            showZero={false}
            dot={false}
            overflowCount={999}
            inline
            size={22}
          >
            <IconBookmark onClick={() => setOpened(!opened)} />
          </Indicator>
        </div>
      </nav>
      <div>
        {car.map((c) => (
          <div key={c.id} className="flex gap-5 m-8">
            <Carousel
              withIndicators
              nextControlIcon={<IconArrowRight size={20} color="cyan" />}
              previousControlIcon={<IconArrowLeft size={20} color="cyan" />}
              className="w-1/3 h-fit border"
            >
              {slides(c)}
            </Carousel>
            <div>
              <Title className="italic">{c.carName}</Title>
              <p className="font-light ">Price ${c.carPrice}</p>
              <Spoiler
                maxHeight={48}
                showLabel="Read more"
                hideLabel="Hide"
                transitionDuration={400}
                w={820}
                className="mt-4"
              >
                <p className="font-bolder">{c.detail}</p>
              </Spoiler>
              <div>
                <div className="mt-4">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                  />
                  <button
                    disabled={!selectedDate}
                    onClick={() => updateDate(selectedDate, c.id)}
                    className="bg-cyan-500 p-2 m-2 rounded-md text-white px-4"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        onClose={() => setOpened(false)}
        title="Bookmarked Cars"
        size="xl"
      >
        {bookmarkedCarList.map((item) => (
          <div key={item.id} className="flex gap-12">
            <div className="mb-8">
              <Image src={item.image[1]} width={250} />
            </div>
            <div>
              <Title>{item.carName}</Title>
              <p>{item.carPrice}</p>
              <button
                className="mt-8 bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-300"
                onClick={() => removeHandeler(item.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </Modal>
    </div>
  );
}

export default CarDetail;
