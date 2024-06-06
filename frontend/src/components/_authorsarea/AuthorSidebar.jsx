import { Nav } from 'react-bootstrap';

export default function AuthorSidebar({ onNavigate }) {

    return (
        <div className="p-4">
            <Nav className="flex-column">
                <button className="btn-white btn-padding mb-3" onClick={() => onNavigate('/authorsarea')}>
                    Dashboard
                </button>

                <button className="btn-violet btn-padding mb-3" onClick={() => onNavigate('addArticle')}>
                    Add Article
                </button>

                <div className="grey-bord p-3 mt-2">
                    <h4 className="admin-title">Admin Area</h4>
                    <Nav.Item 
                        className="admin-link" 
                        onClick={() => onNavigate('authorsList')}
                    >
                        Authors List
                    </Nav.Item>
                    <Nav.Item 
                        className="admin-link" 
                        onClick={() => onNavigate('addAuthor')}
                    >
                        Add Author
                    </Nav.Item>
                </div>
            </Nav>
        </div>
    );
}
