import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/HeroList.css';

function HeroList() {
    // Estado para almacenar la lista de héroes
    const [heroes, setHeroes] = useState([]);
    
    // Estado para los filtros de búsqueda
    const [race, setRace] = useState('');  
    const [publisherName, setPublisherName] = useState('');  
    const [genderName, setGenderName] = useState(''); 
    const [alignmentName, setAlignmentName] = useState('');  
    const [heroId, setHeroId] = useState('');  
    
    // Estado para manejar errores
    const [error, setError] = useState(null);
    
    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);  
    const [totalPages, setTotalPages] = useState(1); 
    
    // Estado para controlar la visibilidad de los modales
    const [showModal, setShowModal] = useState(false);  
    const [showSuccessModal, setShowSuccessModal] = useState(false);  
    
    // Estado para almacenar el ID del héroe seleccionado para eliminar
    const [selectedHeroId, setSelectedHeroId] = useState('');

    // Constante para definir cuántos héroes se muestran por página
    const heroesPerPage = 30;

    // Función para obtener la lista de héroes desde el backend, aplicando filtros y paginación
    const fetchHeroes = (page = 1) => {
        axios.get('http://localhost:5000/api/heroes', {
            params: {
                race: race,
                publisher_name: publisherName,
                gender_name: genderName,
                alignment_name: alignmentName,
                hero_id: heroId,
                page: page,
                limit: heroesPerPage
            }
        })
        .then(response => {
            // Actualizar los héroes y el total de páginas a partir de la respuesta
            setHeroes(response.data.heroes);
            setTotalPages(response.data.totalPages);
        })
        .catch(error => setError(error.message));  
    };

    // useEffect para actualizar la lista de héroes cuando cambian los filtros o la página
    useEffect(() => {
        fetchHeroes(currentPage);  
    }, [currentPage, race, publisherName, genderName, alignmentName, heroId]);

    // Maneja el envío del formulario de búsqueda y reinicia la página a 1
    const handleSearch = (e) => {
        e.preventDefault();  
        setCurrentPage(1); 
        fetchHeroes(1);  
    };

    // Función para eliminar un héroe seleccionado
    const handleDelete = () => {
        axios.delete(`http://localhost:5000/api/heroes/${selectedHeroId}`)
            .then(() => {
                // Filtrar la lista de héroes para eliminar el héroe que se acaba de borrar
                setHeroes(heroes.filter(hero => hero._id !== selectedHeroId));
                setShowModal(false); 
                setShowSuccessModal(true);  
            })
            .catch(error => setError(error.message));  // Capturar errores
    };

    // Función para cambiar la página actual de la lista de héroes
    const handlePageChange = (page) => {
        setCurrentPage(page);  
    };

    // Función para obtener las páginas visibles para la paginación
    const getVisiblePages = () => {
        const maxVisible = 3;  
        const pages = [];
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2)); 
        let end = Math.min(totalPages, start + maxVisible - 1);  
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);  
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);  
        }

        return pages;  
    };

    // Muestra el modal de confirmación de eliminación con el ID del héroe seleccionado
    const handleShowModal = (id) => {
        setSelectedHeroId(id); 
        setShowModal(true);  
    };

    // Cierra el modal de confirmación de eliminación
    const handleCloseModal = () => {
        setShowModal(false);  
    };

    // Cierra el modal de éxito tras eliminar un héroe
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false); 
    };

    // Función para permitir solo números en el campo de búsqueda por ID de héroe
    const handleHeroIdChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {  
            setHeroId(value);  
        }
    };

    // Mostrar un mensaje de error si ocurre algún problema
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div>
            {/* Encabezado del dashboard */}
            <header className="header">
                <h1>Dashboard Heroes</h1>
                <Link to="/add-hero" className="add-hero-button">Add New Hero</Link>
            </header>

            {/* Formulario de búsqueda de héroes */}
            <form className="hero-form" onSubmit={handleSearch}>
                {/* Campo para buscar por ID de héroe */}
                <label htmlFor="heroId">Search by Hero ID: </label>
                <input
                    type="text"
                    id="heroId"
                    value={heroId}
                    onChange={handleHeroIdChange}
                    placeholder="Insert Hero ID"
                />
                {/* Campo para buscar por raza */}
                <label htmlFor="race">Search by Race: </label>
                <input
                    type="text"
                    id="race"
                    value={race}
                    onChange={(e) => setRace(e.target.value)}
                    placeholder="Insert Race"
                />
                {/* Campo para buscar por casa publicadora */}
                <label htmlFor="publisherName">Search by Publisher: </label>
                <input
                    type="text"
                    id="publisherName"
                    value={publisherName}
                    onChange={(e) => setPublisherName(e.target.value)}
                    placeholder="Insert Publisher"
                />
                {/* Campo para buscar por género */}
                <label htmlFor="genderName">Search by Gender: </label>
                <input
                    type="text"
                    id="genderName"
                    value={genderName}
                    onChange={(e) => setGenderName(e.target.value)}
                    placeholder="Insert Gender"
                />
                {/* Campo para buscar por alineación */}
                <label htmlFor="alignmentName">Search by Alignment: </label>
                <input
                    type="text"
                    id="alignmentName"
                    value={alignmentName}
                    onChange={(e) => setAlignmentName(e.target.value)}
                    placeholder="Insert Alignment"
                />
                <button type="submit">Search</button>
            </form>

            {/* Lista de héroes */}
            <div className="hero-list-container">
                {heroes.length > 0 ? (
                    <ul className="hero-list">
                        {heroes.map(hero => (
                            <li key={hero._id}>
                                <h2>{hero.name}</h2>
                                <p><strong>Publisher:</strong> {hero.publisher_name}</p>
                                <p><strong>Gender:</strong> {hero.gender_name}</p>
                                <p><strong>Height:</strong> {hero.height}</p>
                                <p><strong>Weight:</strong> {hero.weight}</p>
                                <div className="hero-actions">
                                    <Link to={`/edit-hero/${hero._id}`}>
                                        <button>Edit Hero</button>
                                    </Link>
                                    <button className="delete" onClick={() => handleShowModal(hero._id)}>Delete Hero</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="no-heroes-message">No heroes found.</div>
                )}
            </div>

            {/* Controles de paginación */}
            <div className="pagination-controls">
                {/* Botón para retroceder una página */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>

                {/* Páginas visibles */}
                {getVisiblePages().map(page => (
                    <button
                        key={page}
                        className={page === currentPage ? 'active' : ''}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                {/* Botón para avanzar una página */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            {/* Modal de confirmación de eliminación */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Hero</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this hero?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de éxito tras eliminar héroe */}
            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Hero Deleted</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The hero has been successfully deleted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseSuccessModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default HeroList;
