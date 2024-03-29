import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Cta from "@layouts/components/Cta";
import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { getListPage } from "../lib/contentParser";
import React, { useState } from "react";
import { Typography, Box, IconButton, Button } from "@mui/material";
import { IoMdCloseCircle } from "react-icons/io";

const Home = ({ frontmatter }) => {
  const { banner, feature, services, workflow, call_to_action } = frontmatter;
  const { title } = config.site;
  const [previewImages, setPreviewImages] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const images = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreviewImages((prevImages) => [...prevImages, ...files]); // Save File objects
      handleExcelFileUpload(files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
  };

  const handleExcelFileUpload = (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("excelFiles", file);
    });

    fetch("sample_api_test", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const removePreviewImage = (index) => {
    setPreviewImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  return (
    <Base title={title}>
      {/* Banner */}
      <section className="section pb-[50px]">
        <div className="container">
          <div className="row text-center">
            <div className="mx-auto lg:col-10">
              <h1 className="font-primary font-bold">{banner.title}</h1>
              <p className="mt-4">{markdownify(banner.content)}</p>
              {banner.button.enable && (
                <Link
                  className="btn btn-primary mt-4"
                  href={banner.button.link}
                  rel={banner.button.rel}
                >
                  {banner.button.label}
                </Link>
              )}
   
            </div>
            <Box
              sx={{
                border: "2px dashed #3f51b5",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.3s ease",
                "&:hover": {
                  borderColor: "#303f9f",
                },
                marginTop: "50px",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              component="label"
              htmlFor="fileInput"
            >
              <input
                type="file"
                id="fileInput"
                accept=".xlsx, .xls"
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple={true}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#3f51b5",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                {banner.excel.label}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#555", marginBottom: "20px" }}
              >
                {banner.excel.description}
              </Typography>
              {previewImages.map((file, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    marginTop: "10px",
                    display: "flex",
                  }}
                >
                  <Image
                    src={banner.excel.image}
                    alt={`Preview`}
                    width={30}
                    height={30}
                  />
                  <Typography variant="body2" style={{ marginLeft: "5px" }}>
                    {file.name}
                  </Typography>{" "}
                  <IconButton
                    onClick={() => removePreviewImage(index)}
                    style={{ position: "absolute", top: 5, right: 5 }}
                  >
                    <IoMdCloseCircle />
                  </IconButton>
                </div>
              ))}
              {previewImages.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExcelFileUpload}
                >
                  Submit
                </Button>
              )}
            </Box>
          </div>
          <Image
                className="mx-auto mt-12"
                src={banner.image}
                width={750}
                height={390}
                alt="banner image"
                priority
              />
        </div>
      </section>

      {/* Features */}
      <section className="section bg-theme-light">
        <div className="container">
          <div className="text-center">
            <h2>{markdownify(feature.title)}</h2>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {feature.features.map((item, i) => (
              <div
                className="feature-card rounded-xl bg-white p-5 pb-8 text-center"
                key={`feature-${i}`}
              >
                {item.icon && (
                  <Image
                    className="mx-auto"
                    src={item.icon}
                    width={30}
                    height={30}
                    alt=""
                  />
                )}
                <div className="mt-4">
                  {markdownify(item.name, "h3", "h5")}
                  <p className="mt-3">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.map((service, index) => {
        const isOdd = index % 2 > 0;
        return (
          <section
            key={`service-${index}`}
            className={`section ${isOdd && "bg-theme-light"}`}
          >
            <div className="container">
              <div className="items-center gap-8 md:grid md:grid-cols-2">
                {/* Carousel */}
                <div className={`service-carousel ${!isOdd && "md:order-2"}`}>
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    pagination={
                      service.images.length > 1 ? { clickable: true } : false
                    }
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    init={service?.images > 1 ? false : true}
                  >
                    {/* Slides */}
                    {service?.images.map((slide, index) => (
                      <SwiperSlide key={index}>
                        <Image src={slide} alt="" width={600} height={500} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Content */}
                <div
                  className={`service-content mt-5 md:mt-0 ${
                    !isOdd && "md:order-1"
                  }`}
                >
                  <h2 className="font-bold leading-[40px]">{service?.title}</h2>
                  <p className="mb-2 mt-4">{service?.content}</p>
                  {service.button.enable && (
                    <Link
                      href={service?.button.link}
                      className="cta-link inline-flex items-center text-primary"
                    >
                      {service?.button.label}
                      <Image
                        className="ml-1"
                        src="/images/arrow-right.svg"
                        width={18}
                        height={14}
                        alt="arrow"
                      />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* workflow */}
      <section className="section pb-0">
        <div className="mb-8 text-center">
          {markdownify(
            workflow.title,
            "h2",
            "mx-auto max-w-[400px] font-bold leading-[44px]"
          )}
          {markdownify(workflow.description, "p", "mt-3")}
        </div>
        <Image
          src={workflow.image}
          alt="workflow image"
          width={1920}
          height={296}
        />
      </section>

      {/* CTA */}
      <Cta cta={call_to_action} />
    </Base>
  );
};

export const getStaticProps = async () => {
  const homePage = await getListPage("content/_index.md");
  const { frontmatter } = homePage;
  return {
    props: {
      frontmatter,
    },
  };
};

export default Home;
