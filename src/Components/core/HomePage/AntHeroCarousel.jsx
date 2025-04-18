import React, { useState } from "react";
import { Carousel, Button, Typography, Row, Col } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  CodeOutlined,
  LayoutOutlined,
  RobotOutlined,
  BookOutlined,
  ThunderboltOutlined,
  AppstoreOutlined,
  BulbOutlined,
  RocketOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import HighlightText from "./HighlightText";
import "./AntHeroCarousel.css";

const { Title, Paragraph } = Typography;

const AntHeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { token } = useSelector((state) => state.auth); // Get auth token to check if user is logged in

  // Carousel slide data
  const carouselData = [
    {
      id: 1,
      title: "Unlock Your Coding Potential",
      description:
        "Join our comprehensive programming courses and master the skills that employers are looking for.",
      ctaText: "Explore Courses",
      ctaLink: "/catalog/Web Development",
      icon: <ThunderboltOutlined className="slide-icon" />,
      gradientFrom: "#1fa2ff",
      gradientTo: "#12d8fa",
      secondaryIcon: <RocketOutlined className="floating-icon" />,
    },
    {
      id: 2,
      title: "Interactive Code Playground",
      description:
        "Practice coding in real-time with our interactive environment. Write, compile, and run code in multiple languages.",
      ctaText: "Try Code Playground",
      ctaLink: "/code-playground",
      icon: <CodeOutlined className="slide-icon" />,
      gradientFrom: "#8a2be2",
      gradientTo: "#4b0082",
      secondaryIcon: <AppstoreOutlined className="floating-icon" />,
    },
    {
      id: 3,
      title: "Master CSS Flexbox Game",
      description:
        "Learn CSS Flexbox by playing our interactive fruit-themed game. Move fruits into baskets using CSS properties.",
      ctaText: "Play FlexBox Game",
      ctaLink: "/fruitbox-flex",
      icon: <LayoutOutlined className="slide-icon" />,
      gradientFrom: "#ff3366",
      gradientTo: "#ba265d",
      secondaryIcon: <NodeIndexOutlined className="floating-icon" />,
    },
    {
      id: 4,
      title: "AI Study Assistant",
      description:
        "Get personalized help with your studies from our AI assistant. Ask questions and receive instant guidance.",
      ctaText: "Chat with AI",
      ctaLink: "/ai-chat",
      icon: <RobotOutlined className="slide-icon" />,
      gradientFrom: "#52c41a",
      gradientTo: "#237804",
      secondaryIcon: <BulbOutlined className="floating-icon" />,
    },
    {
      id: 5,
      title: "Structured Learning Paths",
      description:
        "Follow curated learning journeys designed by industry experts to build your skills systematically.",
      ctaText: "View Learning Paths",
      ctaLink: "/learning-paths",
      icon: <BookOutlined className="slide-icon" />,
      gradientFrom: "#ffa500",
      gradientTo: "#d46b08",
      secondaryIcon: <NodeIndexOutlined className="floating-icon" />,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselData.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselData.length - 1 : prev - 1
    );
  };

  const carouselRef = React.createRef();

  return (
    <div className="hero-carousel-container">
      <Carousel
        ref={carouselRef}
        autoplay
        effect="fade"
        dots={true}
        afterChange={setCurrentSlide}
        arrows
        prevArrow={<LeftOutlined />}
        nextArrow={<RightOutlined />}
        className="hero-carousel"
      >
        {carouselData.map((slide) => (
          <div key={slide.id}>
            <div
              className="carousel-slide"
              style={{
                background: `linear-gradient(118.19deg, ${slide.gradientFrom} -3.62%, ${slide.gradientTo} 50.44%, ${slide.gradientFrom}40 104.51%)`,
              }}
            >
              <div className="slide-pattern"></div>
              <div className="slide-floating-elements">
                <div className="floating-element element-1">
                  {slide.secondaryIcon}
                </div>
                <div className="floating-element element-2">{slide.icon}</div>
                <div className="floating-element element-3">
                  {slide.secondaryIcon}
                </div>
                <div className="floating-element element-4">{slide.icon}</div>
              </div>
              <Row className="slide-content" justify="center" align="middle">
                <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                  <div
                    className="slide-icon-container"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    {slide.icon}
                  </div>
                  <Title level={1} className="slide-title">
                    {slide.title.split(" ").map((word, index) => {
                      return index % 3 === 1 ? (
                        <span
                          key={index}
                          className="highlight-word"
                          style={{ color: "#ffffff" }}
                        >
                          {word}{" "}
                        </span>
                      ) : (
                        <span key={index}>{word} </span>
                      );
                    })}
                  </Title>
                  <Paragraph className="slide-description">
                    {slide.description}
                  </Paragraph>
                  <div className="slide-buttons">
                    <Link to={slide.ctaLink}>
                      <Button
                        type="primary"
                        size="large"
                        className="primary-button"
                        style={{
                          backgroundColor: slide.gradientFrom,
                          borderColor: slide.gradientFrom,
                        }}
                      >
                        {slide.ctaText}
                      </Button>
                    </Link>
                    {/* Only show Sign Up button if user is not logged in */}
                    {!token && (
                      <Link to="/signup">
                        <Button size="large" className="secondary-button">
                          Sign Up Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </Carousel>

      <div className="carousel-controls">
        <Button
          className="carousel-arrow prev"
          icon={<LeftOutlined />}
          onClick={prevSlide}
          shape="circle"
        />
        <div className="carousel-indicators">
          {carouselData.map((_, index) => (
            <div
              key={index}
              className={`carousel-indicator ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => carouselRef.current.goTo(index)}
              style={{
                backgroundColor:
                  index === currentSlide
                    ? "#ffffff"
                    : "rgba(255, 255, 255, 0.5)",
              }}
            />
          ))}
        </div>
        <Button
          className="carousel-arrow next"
          icon={<RightOutlined />}
          onClick={nextSlide}
          shape="circle"
        />
      </div>
    </div>
  );
};

export default AntHeroCarousel;
