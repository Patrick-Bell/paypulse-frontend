export const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

export const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'GBP',
    }).format(amount);
}