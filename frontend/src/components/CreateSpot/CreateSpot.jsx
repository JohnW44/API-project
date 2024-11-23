import './CreateSpot.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addSpot, updateSpot } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { csrfFetch } from '../../store/csrf';

function CreateSpot() {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const existingSpot = useSelector(state => state.spots.spotsObj[spotId]);
  
  const [address, setAddress] = useState(existingSpot?.address || '');
  const [city, setCity] = useState(existingSpot?.city || '');
  const [state, setState] = useState(existingSpot?.state || '');
  const [country, setCountry] = useState(existingSpot?.country || '');
  const [lat, setLat] = useState(existingSpot?.lat || 0);
  const [lng, setLng] = useState(existingSpot?.lng || 0);
  const [name, setName] = useState(existingSpot?.name || '');
  const [description, setDescription] = useState(existingSpot?.description || '');
  const [price, setPrice] = useState(existingSpot?.price || '');
  const [previewImage, setPreviewImage] = useState(existingSpot?.previewImage || '');
  const [errors, setErrors] = useState({});

  const title = spotId ? "Update your Holiday Haven" : "Create a new Holiday Haven";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!description) {
      newErrors.description = "Description is required";}
      else if(description.length < 30){
        newErrors.description = "Description needs 30 or more characters"
      }
    if (!name) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (!previewImage) {
      newErrors.previewImage = "Preview image is required";
    } else {
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const extension = previewImage.slice(previewImage.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(extension)) {
        newErrors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
      }
    }

    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.lat = "Latitude must be a number between -90 and 90";
    }

    
     if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.lng = "Longitude must be a number between -180 and 180";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const spotData = {
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price),
      previewImage
    };

    try {
      let response;
      if (spotId) {
        response = await csrfFetch(`/api/spots/${spotId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(spotData)
        });
      } else {
        response = await csrfFetch('/api/spots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(spotData)
        });
      }

      if (response.ok) {
        const spot = await response.json();
        if (spotId) {
          dispatch(updateSpot(spot));
        } else {
          dispatch(addSpot(spot));
        }
        navigate(`/spots/${spot.id}`);
      }
    } catch (error) {
      console.error('Failed to create spot:', error);
      if (error instanceof Response) {
        const errorData = await error.json();
        console.error('Error details:', errorData);
        setErrors(errorData.errors || { general: "An error occurred while creating the spot." });
      } else {
        setErrors({ general: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className="create-spot">
      <h1>{title}</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where&apos;s your place located?</h2>
          <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>
          <label>
            Country
            {errors.country && <p style={{color: 'red'}}>{errors.country}</p>}
            <input type="text" value={country || ''} 
            onChange={(e) => setCountry(e.target.value)} />
          </label>
          <label>
            Street Address
            {errors.address && <p style={{color: 'red'}}>{errors.address}</p>}
            <input type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} />
          </label>
          <div className="city-state">
            <label>
              City
              {errors.city && <p style={{color: 'red'}}>{errors.city}</p>}
              <input type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} />
            </label>
            <label>
              State
              {errors.state && <p style={{color: 'red'}}>{errors.state}</p>}
              <input type="text" 
              value={state}
               onChange={(e) => setState(e.target.value)} />
            </label>
          </div>
          <div className="lat-lng">
            <div>
              <label htmlFor="lat">Latitude:</label>
              <input
                id="lat"
                name="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lng">Longitude:</label>
              <input
                id="lng"
                name="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>
        </section>
        <hr className="section-divider" />

        <section>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your Holiday Haven, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
          {errors.description && <p style={{color: 'red'}}>{errors.description}</p>}
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Create a title for your Holiday Haven</h2>
          <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
          {errors.name && <p style={{color: 'red'}}>{errors.name}</p>}
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            maxLength="50"
            placeholder="Name of your spot"
          />
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <label>
            $ 
            {errors.price && <p style={{color: 'red'}}>{errors.price}</p>}
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" />
          </label>
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input 
            type="url" 
            value={previewImage} 
            onChange={(e) => setPreviewImage(e.target.value)} 
            placeholder="Preview Image URL" 
          />
          {errors.previewImage && <p style={{color: 'red'}}>{errors.previewImage}</p>}
        </section>
        <hr className="section-divider" />

        <button type="submit">{spotId ? 'Update Spot' : 'Create Spot'}</button>
      </form>
    </div>
  );
}

export default CreateSpot;
