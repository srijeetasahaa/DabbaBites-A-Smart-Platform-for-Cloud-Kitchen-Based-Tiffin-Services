import React, { useState } from 'react';
import './Restaurant.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets'; // Make sure this path is correct

const Restaurant = ({ url }) => {
  const [image, setImage] = useState(false);
  const [pdf, setPdf] = useState(null); // 🆕 Optional PDF state
  const [data, setData] = useState({
    name: "",
    pincode: "",
    address: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("pincode", data.pincode);
    formData.append("address", data.address);
    formData.append("phone", data.phone);
    if (image) {
      formData.append("image", image);
    }

    // ⚠️ PDF is not sent to the backend

    try {
      const response = await axios.post(`${url}/api/restaurant/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          pincode: "",
          address: "",
          phone: ""
        });
        setImage(false);
        setPdf(null); // 🆕 Reset PDF
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add restaurant");
      console.error("Error:", error);
    }
  };

  return (
    <div className='restaurant'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="restaurant-img-upload flex-col">
          <p>Upload Restaurant Image</p>
          <label htmlFor="image">
            <img 
              src={image ? URL.createObjectURL(image) : assets.upload_area} 
              alt="Upload area" 
            />
          </label>
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id='image' 
            hidden 
            accept="image/*"
          />
        </div>

        {/* 🆕 PDF Upload Section */}
        <div className="restaurant-pdf-upload flex-col">
          <p>Upload FSSAI License (PDF) <span style={{ fontWeight: 400, fontSize: "0.9em" }}>(Optional)</span></p>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={(e) => setPdf(e.target.files[0])} 
          />
          {pdf && <small>{pdf.name}</small>}
        </div>

        <div className="restaurant-name flex-col">
          <p>Restaurant Name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name='name' 
            placeholder='Enter restaurant name' 
            required 
          />
        </div>
        
        <div className="restaurant-phone flex-col">
          <p>Phone Number</p>
          <input 
            onChange={onChangeHandler} 
            value={data.phone} 
            type="tel" 
            name='phone' 
            placeholder='Enter phone number' 
            required 
            pattern="[0-9]{10}"
            title="Please enter a 10-digit phone number"
          />
        </div>
        
        <div className="restaurant-pincode flex-col">
          <p>Pin Code</p>
          <input 
            onChange={onChangeHandler} 
            value={data.pincode} 
            type="text" 
            name='pincode' 
            placeholder='Enter pin code' 
            required 
            pattern="[0-9]{6}"
            title="Please enter a 6-digit pin code"
          />
        </div>
        
        <div className="restaurant-address flex-col">
          <p>Address</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.address} 
            name="address" 
            rows="4" 
            placeholder='Enter full address' 
            required
          ></textarea>
        </div>
        
        <button type='submit' className='restaurant-btn'>
          Save Restaurant
        </button>
      </form>
    </div>
  );
};

export default Restaurant;
