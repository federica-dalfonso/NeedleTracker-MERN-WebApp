import "./AllArticles.css";
import { useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import ArticleCard from './ArticleCard';

const categories = [
    { name: 'vinyl reviews', imageUrl: 'https://bit.ly/3wSYfye' },
    { name: 'collecting tips', imageUrl: 'https://bit.ly/451iWV7' },
    { name: 'vinyl culture', imageUrl: 'https://bit.ly/3X2BcM6' },
    { name: 'sound systems', imageUrl: 'https://bit.ly/3Vj5wAB' },
];

export default function AllArticles ({ articleList }) {

    //stato per categorie selezionate:
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const filteredArticles = selectedCategory
        ? articleList.filter(article => article.category === selectedCategory)
        : articleList;

    return (
        <>
        <Container className="my-5">
            <Row>
                <Col xs={12}>
                    <Row xs={1} md={1} lg={1}>
                       <div className="d-flex justify-content-center flex-wrap gap-3 mt-3 mb-4">
                            {categories.map((category, index) => (
                                <Col key={index}>
                                    <div className="category-image-wrapper" onClick={() => handleCategoryClick(category.name)} >
                                        <div className="category-image-container">
                                            <Image src={category.imageUrl} className="category-image" />
                                            <button className="category-button">
                                                {category.name}
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </div> 
                    </Row>
                    
                    {selectedCategory && (
                        <div className="d-flex justify-content-center mb-2">
                            <button className="btn-padding btn-violet" onClick={() => setSelectedCategory(null)}>
                                Show All
                            </button>
                        </div>
                    )}
                </Col>
                
                <Col xs={12}> 
                    <div className="text-center my-3" id="#articles">
                        <h1 className="titles-hr text-uppercase fs-3 py-3">
                            {selectedCategory ? `#${selectedCategory}` : 'All Articles'}
                        </h1>  
                    </div>                                            
                </Col>
                
                {filteredArticles.map((article, index) => (
                    <Col xs={12} md={6} lg={4} key={index} className="my-4">
                        <ArticleCard article={article}/>
                    </Col>
                ))}
            </Row>
        </Container>
        </>
    );
};

