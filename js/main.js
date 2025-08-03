/*
 * HealthVault JavaScript
 * Handles tab navigation, charts, form submissions and other interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Update year in all footers
    const now = new Date();
    // Set current year on all elements with id starting with 'year'
    const yearSpans = document.querySelectorAll('[id^="year"]');
    yearSpans.forEach(span => {
        span.textContent = now.getFullYear();
    });

    // Features page tab navigation
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    if (tabLinks.length) {
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                // remove active class from all links
                tabLinks.forEach(l => l.classList.remove('active'));
                // hide all panes
                tabPanes.forEach(pane => pane.classList.remove('active'));
                // activate selected
                link.classList.add('active');
                const targetId = link.getAttribute('data-tab');
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.classList.add('active');
                // If the tracking tab is selected ensure chart is drawn
                if (targetId === 'tracking') {
                    drawFeatureChart();
                }
            });
        });
        // Draw chart initially on features page when loaded
        drawFeatureChart();
    }

    // Tracker page chart setup
    const trackerForm = document.getElementById('trackerForm');
    const progressCtx = document.getElementById('progressChart');
    if (trackerForm && progressCtx) {
        const labels = [];
        const stepsData = [];
        const caloriesData = [];
        const heartRateData = [];

        const progressChart = new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Steps',
                        data: stepsData,
                        borderColor: '#1ba784',
                        backgroundColor: 'rgba(27, 167, 132, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Calories Burned',
                        data: caloriesData,
                        borderColor: '#2077c7',
                        backgroundColor: 'rgba(32, 119, 199, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Heart Rate',
                        data: heartRateData,
                        borderColor: '#e6a019',
                        backgroundColor: 'rgba(230, 160, 25, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });

        trackerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const date = document.getElementById('date').value;
            const steps = parseInt(document.getElementById('steps').value, 10);
            const calories = parseInt(document.getElementById('calories').value, 10);
            const hr = parseInt(document.getElementById('heartrate').value, 10);
            if (!date || isNaN(steps) || isNaN(calories) || isNaN(hr)) {
                alert('Please fill out all fields correctly.');
                return;
            }
            labels.push(date);
            stepsData.push(steps);
            caloriesData.push(calories);
            heartRateData.push(hr);
            progressChart.update();
            trackerForm.reset();
        });
    }

    // Emergency page donor search
    const donorForm = document.getElementById('donorForm');
    if (donorForm) {
        const donorResults = document.getElementById('donorResults');
        // Mock dataset of donors
        const donors = [
            { name: 'Ravi Kumar', bloodType: 'A+', city: 'Bengaluru', phone: '+91 98765 43210' },
            { name: 'Priya Sharma', bloodType: 'O-', city: 'Mumbai', phone: '+91 98765 12345' },
            { name: 'Anil Mehta', bloodType: 'B+', city: 'Bengaluru', phone: '+91 87654 32109' },
            { name: 'Sneha Rao', bloodType: 'AB+', city: 'Delhi', phone: '+91 76543 21098' }
        ];
        donorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('bloodType').value;
            const city = document.getElementById('city').value.trim().toLowerCase();
            donorResults.innerHTML = '';
            if (!type || !city) {
                donorResults.innerHTML = '<p>Please enter a valid blood type and city.</p>';
                return;
            }
            const matches = donors.filter(d => d.bloodType === type && d.city.toLowerCase() === city);
            if (matches.length === 0) {
                donorResults.innerHTML = `<p>No donors found for ${type} in ${city.charAt(0).toUpperCase() + city.slice(1)}. Try a different search or contact your nearest hospital.</p>`;
            } else {
                matches.forEach(donor => {
                    const card = document.createElement('div');
                    card.className = 'donor-card';
                    card.innerHTML = `<h4>${donor.name}</h4><p>Blood Type: ${donor.bloodType}</p><p>City: ${donor.city}</p><p>Contact: ${donor.phone}</p>`;
                    donorResults.appendChild(card);
                });
            }
        });
    }

    // Login page tab toggles and form submissions
    const loginTabBtn = document.getElementById('loginTab');
    const registerTabBtn = document.getElementById('registerTab');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    if (loginTabBtn && registerTabBtn) {
        loginTabBtn.addEventListener('click', () => {
            loginTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
            loginSection.classList.add('active');
            registerSection.classList.remove('active');
        });
        registerTabBtn.addEventListener('click', () => {
            registerTabBtn.classList.add('active');
            loginTabBtn.classList.remove('active');
            registerSection.classList.add('active');
            loginSection.classList.remove('active');
        });
    }

    // Auth form submissions: simple messages
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login successful! (Demo)');
            loginForm.reset();
        });
    }
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registration successful! (Demo)');
            registerForm.reset();
        });
    }

    // Records page file upload handler
    const documentsInput = document.getElementById('documents');
    const fileListContainer = document.getElementById('fileList');
    const generateBtn = document.getElementById('generateReportBtn');
    if (documentsInput) {
        documentsInput.addEventListener('change', function() {
            // Clear list
            if (fileListContainer) {
                fileListContainer.innerHTML = '';
            }
            if (generateBtn) {
                generateBtn.disabled = this.files.length === 0;
            }
            // Show selected file names
            Array.from(this.files).forEach(file => {
                const div = document.createElement('div');
                div.className = 'file-item';
                div.textContent = file.name;
                if (fileListContainer) fileListContainer.appendChild(div);
            });
        });
    }
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            // In real application, we would process files here
            window.location.href = 'report.html';
        });
    }
});

// Draw Chart on features page (global function to avoid duplication)
function drawFeatureChart() {
    const chartElem = document.getElementById('trackingChart');
    if (!chartElem) return;
    // Avoid duplicating charts on repeated calls
    if (chartElem.getAttribute('data-chart')) return;
    const ctx = chartElem.getContext('2d');
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const steps = [5000, 7500, 6200, 8000, 9000, 7000, 8500];
    const calories = [400, 550, 500, 600, 650, 520, 580];
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Steps',
                    data: steps,
                    backgroundColor: 'rgba(27, 167, 132, 0.6)',
                    borderColor: '#1ba784',
                    borderWidth: 1
                },
                {
                    label: 'Calories Burned',
                    data: calories,
                    backgroundColor: 'rgba(32, 119, 199, 0.6)',
                    borderColor: '#2077c7',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Day'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Count'
                    },
                    beginAtZero: true
                }
            }
        }
    });
    chartElem.setAttribute('data-chart', 'true');
}