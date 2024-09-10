import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditHero.css';

function EditHero() {
    const { id } = useParams(); 
    const navigate = useNavigate(); 
    const [hero, setHero] = useState(null); 
    const [error, setError] = useState(null); 
    const [formError, setFormError] = useState(null); 
    const [successMessage, setSuccessMessage] = useState(null); 

// Recupera los datos del héroe cuando el componente se monta o cambia el ID
    useEffect(() => {
        axios.get(`http://localhost:5000/api/heroes/${id}`)
            .then(response => {
                setHero(response.data); 
            })
            .catch(error => {
                setError(error.message); 
            });
    }, [id]);

// Manejar cambios de entrada y actualizar el estado del héroe
    const handleChange = (e) => {
        setHero({
            ...hero,
            [e.target.name]: e.target.value
        });
    };

// Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones de los IDs
        if (hero.publisher_id < 1 || hero.publisher_id > 25) {
            setFormError('Publisher ID must be between 1 and 25.');
            return;
        }
        if (hero.alignment_id < 1 || hero.alignment_id > 3) {
            setFormError('Alignment ID must be between 1 and 3.');
            return;
        }
        if (hero.gender_id < 1 || hero.gender_id > 2) {
            setFormError('Gender ID must be between 1 and 2.');
            return;
        }

        setFormError(null); 

// Formulario de carga, error o héroe
        axios.put(`http://localhost:5000/api/heroes/${id}`, hero)
            .then(response => {
                setSuccessMessage('Hero updated successfully!'); 
            })
            .catch(error => {
                setError(error.message); 
            });
    };

    const handleCancel = () => {
        navigate('/');
    };

    const handleCloseModal = () => {
        setSuccessMessage(null);
        navigate('/');
    };

    if (error) return <div>Error: {error}</div>;
    if (!hero) return <div>Loading...</div>;

    return (
        <div className="edit-hero-container">
            <div className="hero-card">
                <button className="back-button" onClick={() => navigate('/')}>Back to Heroes List</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                <div className="hero-header">
                    <h1>Edit Hero</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={hero.name}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <label htmlFor="eye_color">Eye Color: </label>
                    <input
                        type="text"
                        id="eye_color"
                        name="eye_color"
                        value={hero.eye_color}
                        onChange={handleChange}
                    />
                    <br />
                    <label htmlFor="hair_color">Hair Color: </label>
                    <input
                        type="text"
                        id="hair_color"
                        name="hair_color"
                        value={hero.hair_color}
                        onChange={handleChange}
                    />
                    <br />
                    <label htmlFor="skin_color">Skin Color: </label>
                    <input
                        type="text"
                        id="skin_color"
                        name="skin_color"
                        value={hero.skin_color}
                        onChange={handleChange}
                    />
                    <br />
                    <label htmlFor="height">Height: </label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        value={hero.height}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <label htmlFor="weight">Weight: </label>
                    <input
                        type="number"
                        id="weight"
                        name="weight"
                        value={hero.weight}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <label htmlFor="race">Race: </label>
                    <input
                        type="text"
                        id="race"
                        name="race"
                        value={hero.race}
                        onChange={handleChange}
                    />
                    <br />
                    <label htmlFor="publisher_id">Publisher ID: </label>
                    <input
                        type="number"
                        id="publisher_id"
                        name="publisher_id"
                        value={hero.publisher_id}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <label htmlFor="gender_id">Gender ID: </label>
                    <input
                        type="number"
                        id="gender_id"
                        name="gender_id"
                        value={hero.gender_id}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <label htmlFor="alignment_id">Alignment ID: </label>
                    <input
                        type="number"
                        id="alignment_id"
                        name="alignment_id"
                        value={hero.alignment_id}
                        onChange={handleChange}
                        required
                    />
                    <br />
                    <button type="submit" className="update-button">Update Hero</button>
                    {formError && <div className="form-error-message">{formError}</div>}
                </form>
                {successMessage && (
                    <div className="success-modal-overlay">
                        <div className="success-modal">
                            <p>{successMessage}</p>
                            <button className="ok-button" onClick={handleCloseModal}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditHero;
