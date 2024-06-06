import { ListGroup } from "react-bootstrap";
import ModifyArticle from "./ModifyArticle";
import DeleteArticle from "./DeleteArticle";

export default function ArticleList({ articles, setArticles, convertFile }) {
    
    return (
        <>
        <div className="my-5">
            <h4 className="admin-title">Your articles</h4>
            <ListGroup className="mt-3">
            {articles && articles.length > 0 ?
            (
             articles.map((single, index) => {
                return <ListGroup.Item className="d-flex align-items-center justify-content-between list-bord rounded-0" key={index}>
                        <span className="fst-italic">{single.title}</span>
                        <div className="d-flex gap-3">
                            <ModifyArticle single={single} articles={articles} setArticles={setArticles} convertFile={convertFile}/>
                            <DeleteArticle single={single} articles={articles} setArticles={setArticles}/>
                        </div>
                        </ListGroup.Item>   
            })       
            ) : (
                <span className="fw-light">no articles available</span>
            )}                                   
            </ListGroup>           
        </div>
            
        </>
    );
}
