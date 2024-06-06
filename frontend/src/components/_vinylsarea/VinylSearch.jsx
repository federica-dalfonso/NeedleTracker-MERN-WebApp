import "./VinylSearch.css";
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useState } from "react";

export default function VinylSearch ({onSearch}) {

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [yearOfRel, setYearOfRel] = useState('');

  const handleInputValue = (e) => {
    e.preventDefault();
    
    const keywords = {};
    if (title) keywords.title = title;
    if (artist) keywords.artist = artist;
    if (genre) keywords.genre = genre;
    if (yearOfRel) keywords.yearOfRel = yearOfRel;

    onSearch(keywords);
    resetForm();
  }

  //funzione reset:
  const resetForm = () => {
    setTitle("");
    setArtist("");
    setGenre("");
    setYearOfRel("");
  }

  return (
  <>
    <Container fluid id="searchContainer">
      <Row className="row-width">

        <Col md={12}>
          <div className="text-center">
            <h1 className="fs-2">Discover Your Next Rare Find</h1> 
            <p className="fs-5">Search by title, artist, genre or year of release to find your next prized vinyl</p>
          </div>
          <Form className="pb-3 bg-form-search" onSubmit={handleInputValue}>
            <Row>

              <Col md={6}>

                <Form.Group controlId="searchForTitle" className="py-1">
                  <Form.Label className="mb-1">Title</Form.Label>
                    <Form.Control type="text" placeholder="ex. 'Innuendo'" className="input-bord bg-greyscale"
                    value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>

              </Col>

              <Col md={6}>
                <Form.Group controlId="searchForArtist" className="py-1">
                  <Form.Label className="mb-1">Artist</Form.Label>
                    <Form.Control type="text" placeholder="ex. 'Queen'" className="input-bord bg-greyscale"
                    value={artist} onChange={(e) => setArtist(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="searchForGenre" className="py-1">
                  <Form.Label className="mb-1">Genre</Form.Label>
                    <Form.Control type="text" placeholder="ex. 'progressive rock'" className="input-bord bg-greyscale" 
                    value={genre} onChange={(e) => setGenre(e.target.value)}/>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="searchForYear" className="py-1">
                  <Form.Label className="mb-1">Year of Release</Form.Label>
                    <Form.Control type="text" placeholder="ex. 1991" className="input-bord bg-greyscale" 
                    value={yearOfRel} onChange={(e) => setYearOfRel(e.target.value)}/>
                </Form.Group>
              </Col>

            </Row>
            <div className="d-flex align-items-center justify-content-center">
              <button className="btn-violet btn-padding mt-3 w-25" type="submit">Search</button>
            </div>            
          </Form>

        </Col>
      </Row>
    </Container>
  </>
  );
};
