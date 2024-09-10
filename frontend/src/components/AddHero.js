import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/AddHero.css';

function AddHero() {
    // Estado para almacenar la información del héroe
    const [hero, setHero] = useState({
        hero_id: '',
        name: '',
        eye_color: '',
        hair_color: '',
        skin_color: '',
        height: '',
        weight: '',
        race: '',
        publisher_id: '',
        gender_id: '',
        alignment_id: ''
    });

    // Estado para manejar errores
    const [error, setError] = useState(null);

    // Estado para manejar el mensaje de éxito
    const [successMessage, setSuccessMessage] = useState(null);

    // Hook para la navegación programática
    const navigate = useNavigate();

    // Función para manejar los cambios en los campos del formulario
    const handleChange = (e) => {
        setHero({
            ...hero,
            [e.target.name]: e.target.value
        });
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();  
        
        setSuccessMessage(null);  

        // Validaciones de los IDs
        if (hero.publisher_id < 1 || hero.publisher_id > 25) {
            setError('Publisher ID must be between 1 and 25');
            return;
        }
        if (hero.alignment_id < 1 || hero.alignment_id > 3) {
            setError('Alignment ID must be between 1 and 3');
            return;
        }
        if (hero.gender_id < 1 || hero.gender_id > 2) {
            setError('Gender ID must be between 1 and 2');
            return;
        }

        // Enviar la solicitud POST para agregar un nuevo héroe
        axios.post('http://localhost:5000/api/heroes', hero)
            .then(response => {
                setSuccessMessage('Hero added successfully!');  
                // Limpiar el formulario después de agregar el héroe
                setHero({
                    hero_id: '',
                    name: '',
                    eye_color: '',
                    hair_color: '',
                    skin_color: '',
                    height: '',
                    weight: '',
                    race: '',
                    publisher_id: '',
                    gender_id: '',
                    alignment_id: ''
                });
                setError(null);  
            })
            .catch(error => {
                // Manejo de errores de la solicitud
                if (error.response && error.response.status === 409) {
                    setError('Hero ID already exists, please choose a different ID');
                } else {
                    setError(error.response ? error.response.data.message : error.message);
                }
            });
    };

    return (
        <div className="add-hero-container">
            {/* Contenedor de la tarjeta del héroe */}
            <div className="hero-card">
                {/* Botón para regresar a la lista de héroes */}
                <button className="back-button" onClick={() => navigate('/')}>Back to Heroes List</button>
                <div className="hero-header">
                    <h1>Add New Hero</h1>
                </div>
                {/* Formulario para agregar un nuevo héroe */}
                <form onSubmit={handleSubmit}>
                    {/* Campo para ID del héroe */}
                    <label htmlFor="hero_id">Hero ID: </label>
                    <input
                        type="number"
                        id="hero_id"
                        name="hero_id"
                        value={hero.hero_id}
                        onChange={handleChange}
                        placeholder="Enter Hero ID"
                        required
                    />
                    
                    {/* Campo para nombre del héroe */}
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={hero.name}
                        onChange={handleChange}
                        placeholder="Enter Hero Name"
                        required
                    />
    
                    {/* Campo para color de ojos */}
                    <label htmlFor="eye_color">Eye Color: </label>
                    <input
                        type="text"
                        id="eye_color"
                        name="eye_color"
                        value={hero.eye_color}
                        onChange={handleChange}
                        placeholder="Enter Eye Color"
                    />
    
                    {/* Campo para color de cabello */}
                    <label htmlFor="hair_color">Hair Color: </label>
                    <input
                        type="text"
                        id="hair_color"
                        name="hair_color"
                        value={hero.hair_color}
                        onChange={handleChange}
                        placeholder="Enter Hair Color"
                    />
    
                    {/* Campo para color de piel */}
                    <label htmlFor="skin_color">Skin Color: </label>
                    <input
                        type="text"
                        id="skin_color"
                        name="skin_color"
                        value={hero.skin_color}
                        onChange={handleChange}
                        placeholder="Enter Skin Color"
                    />
    
                    {/* Campo para altura */}
                    <label htmlFor="height">Height: </label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        value={hero.height}
                        onChange={handleChange}
                        placeholder="Enter Height"
                        required
                    />
    
                    {/* Campo para peso */}
                    <label htmlFor="weight">Weight: </label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={hero.weight}
                        onChange={handleChange}
                        placeholder="Enter Weight"
                        required
                    />
    
                    {/* Campo para raza */}
                    <label htmlFor="race">Race: </label>
                    <input
                        type="text"
                        id="race"
                        name="race"
                        value={hero.race}
                        onChange={handleChange}
                        placeholder="Enter Race"
                    />
    
                    {/* Campo para ID de casa publicadora */}
                    <label htmlFor="publisher_id">Publisher ID: </label>
                    <input
                        type="number"
                        id="publisher_id"
                        name="publisher_id"
                        value={hero.publisher_id}
                        onChange={handleChange}
                        placeholder="Enter Publisher ID"
                        required
                    />
    
                    {/* Campo para ID de género */}
                    <label htmlFor="gender_id">Gender ID: </label>
                    <input
                        type="number"
                        id="gender_id"
                        name="gender_id"
                        value={hero.gender_id}
                        onChange={handleChange}
                        placeholder="Enter Gender ID"
                        required
                    />
    
                    {/* Campo para ID de alineación */}
                    <label htmlFor="alignment_id">Alignment ID: </label>
                    <input
                        type="number"
                        id="alignment_id"
                        name="alignment_id"
                        value={hero.alignment_id}
                        onChange={handleChange}
                        placeholder="Enter Alignment ID"
                        required
                    />
    
                    {/* Botón para enviar el formulario */}
                    <button type="submit">Add Hero</button>
    
                    {/* Mensaje de error */}
                    {error && <div className="error-message">{error}</div>}
                    
                    {/* Modal de éxito */}
                    {successMessage && (
                        <div className="success-modal-overlay">
                            <div className="success-modal">
                                <p>{successMessage}</p>
                                <button onClick={() => setSuccessMessage(null)}>Close</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AddHero;
