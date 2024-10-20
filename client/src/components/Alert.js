import React from 'react';

const Alert = ({ alerts }) => {
    return (
        <div className="alert">
            {alerts.map((alert, index) => (
                <p key={index}>{alert}</p>
            ))}
        </div>
    );
};

export default Alert;
