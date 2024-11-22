import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



const ImageCarousel = ({ images }) => {
    const [mainImage, setMainImage] = useState(images[0]?.filename);

    useEffect(() => {
        setMainImage(images[0]?.filename);
    }, [images]);


    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="carousel-arrow next-arrow" onClick={onClick}>
                <FontAwesomeIcon icon={faArrowRight} />
            </div>
        );
    };

    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <div className="carousel-arrow prev-arrow" onClick={onClick}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
        );
    };

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        dots: false,
    };


    return (
        <div>
            <div className="box mb-5 p-5" style={{
                backgroundImage: `url(${mainImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                width: '100%',
                height: '350px',
                boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                borderRadius: '20px'
                }}>
            </div>
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} onClick={() => setMainImage(image.filename)} style={{ cursor: 'pointer' }}>
                        <img src={image.filename} alt={`image-${index}`} className='carousel-image' style={{ width: '50%' }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageCarousel;
