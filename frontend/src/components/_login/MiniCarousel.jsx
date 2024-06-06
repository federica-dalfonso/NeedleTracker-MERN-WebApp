import "./MiniCarousel.css";
import { Carousel } from 'react-bootstrap';

export default function MiniCarousel () {

    return (
        <>         
         <Carousel>
            <Carousel.Item interval={4000}>
                <div className="carousel-item-box">
                    <img
                        className="d-block w-100 img-details"
                        src="https://www.rollingstone.co.uk/wp-content/uploads/sites/2/2022/05/SexPistols-7Inch-001-1-1024x788.jpg"
                        alt="First slide"
                    />

                    <div className="carousel-description">
                        <p>Did you know? Sex Pistols' 'God Save The Queen' is one of the rarest vinyl records in the world.</p>
                        <div className="d-flex justify-content-center">
                            <div className="carousel-m-5">—</div>
                            <div className="carousel-m-5">—</div>
                            <div className="carousel-m-5">—</div>
                        </div>
                    </div>
                </div>
            </Carousel.Item>

            <Carousel.Item interval={4000}>
                <div className="carousel-item-box">
                    <img
                        className="d-block w-100 img-details"
                        src="https://i.etsystatic.com/23856871/r/il/e7b624/3513168727/il_fullxfull.3513168727_i3ao.jpg"
                        alt="Second slide"
                    />

                    <div className="carousel-description">
                        <p>The best-selling album in the history of music is Michael Jackson's Thriller, with 66 million copies sold worldwide!</p>
                        <div className="d-flex justify-content-center">
                            <div className="carousel-m-5">—</div>
                            <div className="carousel-m-5">—</div>
                            <div className="carousel-m-5">—</div>
                        </div>
                    </div>
                </div>
            </Carousel.Item>

            <Carousel.Item interval={4000}>
                <div className="carousel-item-box">
                    <img
                        className="d-block w-100 img-details"
                        src="https://images.45cat.com/eddy-arnold-texarkana-baby-1949-10.jpg"
                        alt="Third slide"
                    />

                    <div className="carousel-description">
                        <p>The first 45 RPM record in history was 'Texarkana Baby' by Eddy Arnold, released on March 31, 1949, by RCA Victor.</p>
                        <div className="d-flex justify-content-center">
                            <div className="carousel-m-5">—</div>
                            <div className="carousel-m-5">—</div>
                            <div className="carousel-m-5">—</div>
                        </div>
                    </div>
                </div>
            </Carousel.Item>
            </Carousel>
        </>
   
  );
};

