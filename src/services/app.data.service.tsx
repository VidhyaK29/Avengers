const BASE_URL = "https://wxcqc4z5fd.execute-api.us-west-2.amazonaws.com/dev";

const apiUrl = (endpoint: any) => `${BASE_URL}/${endpoint}`;

const authService = {
    isUserLoggedIn: () => Boolean(sessionStorage.getItem("userId")),
    getUserEmail: () => sessionStorage.getItem("userEmail"),  
  getUserData: () => sessionStorage.getItem("customerData"),

    setUserEmail: (email: any) => sessionStorage.setItem("userEmail", email),
};

const appDataService = {
    fetchCounts: async () => {
        try {
            const response = await fetch(apiUrl("counts"));
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching counts:", error);
            throw error;
        }
    },

    fetchSuppliers: async () => {
        try {
            const response = await fetch(apiUrl("suppliers/"));    
            // Check if the response is not OK (e.g., 404, 500)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            console.log(data, '@@');
            return data; // No need to parse again if it's already JSON
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            throw error;
        }
    },
    

    fetchOrders: async () => {
        try {
            const userData = authService.getUserData();
            let userId = null;
    
            if (userData) {
                try {
                    const parsedData = JSON.parse(userData);
                    userId = parsedData.id; // Extract the user ID
                } catch (error) {
                    console.warn("Failed to parse customer data", error);
                }
            }
    
            const endpoint = userId ? `customer-orders?customerId=${userId}` : "orders";
            const response = await fetch(apiUrl(endpoint));
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            let data = await response.json();
    
            // Handle cases where data is inside a stringified "body" field
            if (typeof data === "object" && data.body) {
                try {
                    data = JSON.parse(data.body);
                } catch (error) {
                    console.warn("Failed to parse 'body' as JSON", error);
                }
            }
    
            return data;
        } catch (error) {
            console.error("Error fetching orders:", error);
            throw error;
        }
    },
    
    fetchCustomerDetails: async () => {
        try {
            const userEmail = authService.getUserEmail();
            const response = await fetch(apiUrl(`customer-details?email=${userEmail}`));
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    },

    fetchCustomers: async () => {
        try {
            const response = await fetch(apiUrl("customers/"));
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    },

    fetchProducts: async () => {
        try {
            const response = await fetch(apiUrl("products/"));
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    },

    fetchEmails: async () => {
        try {
            const response = await fetch(apiUrl("emails/"));
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching emails:", error);
            throw error;
        }
    },
};

export { appDataService, authService };