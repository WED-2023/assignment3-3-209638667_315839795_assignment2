<template>
    <div class="about-container">
        <!-- Page Header -->
        <div class="about-header">
            <h1 class="about-title">About Granny's Recipes</h1>
            <p class="about-subtitle">Learn more about our recipe sharing platform and the team behind it</p>
        </div>

        <!-- Content Sections -->
        <div class="about-content">

            <!-- Section 1: About the Developers -->
            <section class="about-section developers-section">
                <div class="section-icon">👥</div>
                <h2 class="section-title">About the Developers</h2>
                <div class="developers-grid">
                    <div class="developer-card">
                        <h3>Tomer</h3>
                        <p class="developer-role">Full Stack Developer</p>
                        <p class="developer-bio">
                            My name is Tomer, and I am a Software and Information Systems Engineering student at BGU.
                        </p>
                        <p>My main focus in this project was the backend development and the DB design. </p>
                        <p>I really like cooking and I am actually the one who cooks the most at home and makes the
                            most tasty meals.</p>
                    </div>
                    <div class="developer-card">
                        <h3>May-Tal</h3>
                        <p class="developer-role">Full Stack Developer</p>
                        <p class="developer-bio">
                            My name is May-tal, in addition to being a Software and Information Systems
                            Engineering at BGU I am an Automation Engineer and a Pilates Instructor. </p>
                        <p>Both Tomer and I split the project parts equally, I was more focused on the fronted and the
                            UX/UI of the website. Also, the design of the API.</p>
                        <p>I am very passionate about cooking and baking healthy and vegan recepies (even though I am
                            not vegan).</p>
                    </div>
                </div>
                <div class="team-statement">
                    <p>
                        We had a great time working on this project together, combining our skills and
                        passion for food to create a great platform.
                    </p>
                    <p>We worked on this project together most of the time, collaborating closely to ensure its success.
                        Mainly Tomer was responsible for the backend development and database design, while May-tal
                        focused on the frontend, user experience and the API design. </p>
                </div>
            </section>

            <!-- Section 2: About the Website -->
            <section class="about-section website-section">
                <div class="section-icon">🍳</div>
                <h2 class="section-title">About the Website</h2>
                <div class="section-content">

                    <h3>Key Features</h3>
                    <ul class="features-list">
                        <li>
                            <strong>Recipe Discovery:</strong> Browse through a vast collection of recipes from
                            various cuisines, with detailed nutritional information and cooking instructions.
                        </li>
                        <li>
                            <strong>Personal Recipe Collection:</strong> Save your favorite recipes, create custom
                            collections, and track what you've cooked with our "last viewed" feature.
                        </li>
                        <li>
                            <strong>Family Recipes:</strong> A special section dedicated to preserving family culinary
                            traditions, where cherished recipes passed down through generations are showcased.
                        </li>
                        <li>
                            <strong>Smart Search & Filtering:</strong> Find exactly what you're looking for with
                            advanced search capabilities, dietary filters (vegan, vegetarian, gluten-free), and
                            cuisine-based browsing.
                        </li>
                        <li>
                            <strong>Meal Planning:</strong> Plan your meals for the week with our intelligent meal
                            planning feature that considers your preferences and dietary restrictions.
                        </li>
                        <li>
                            <strong>User Profiles:</strong> Create your own profile, manage your recipes, and keep
                            track of your culinary journey.
                        </li>
                    </ul>

                    <h3>What Makes Us Special</h3>
                    <p>
                        Unlike other recipe websites, Granny's Recipes focuses on the stories behind the food.
                        Every recipe can tell a story - whether it's a family tradition, a cultural celebration,
                        or a personal discovery. We believe that food is more than just ingredients and instructions;
                        it's about memories, connections, and sharing love through cooking.
                    </p>
                </div>
            </section>

            <!-- Section 3: About the Development -->
            <section class="about-section development-section">
                <div class="section-icon">💻</div>
                <h2 class="section-title">About the Development Process</h2>
                <div class="section-content">
                    <h3>Technology Stack</h3>
                    <div class="tech-grid">
                        <div class="tech-category">
                            <h4>Frontend</h4>
                            <ul>
                                <li><strong>Vue.js 2:</strong> Progressive JavaScript framework for building the user
                                    interface</li>
                                <li><strong>Vue Router:</strong> For seamless navigation between pages</li>
                                <li><strong>Axios:</strong> For handling HTTP requests to our backend API</li>
                                <li><strong>Bootstrap Vue:</strong> For responsive and modern UI components</li>
                            </ul>
                        </div>
                        <div class="tech-category">
                            <h4>Backend</h4>
                            <ul>
                                <li><strong>Node.js:</strong> JavaScript runtime for server-side development</li>
                                <li><strong>Express.js:</strong> Web application framework for building RESTful APIs
                                </li>
                                <li><strong>MySQL:</strong> Relational database for storing recipes and user data</li>
                                <li><strong>Spoonacular API:</strong> External API for accessing a vast recipe database
                                </li>
                            </ul>
                        </div>
                    </div>

                    <h3>Development Approach</h3>
                    <p>
                        We followed an agile development methodology, breaking down the project into manageable sprints.
                        Our approach emphasized:
                    </p>
                    <ul>
                        <li>Clean, maintainable code architecture with clear separation of concerns</li>
                        <li>RESTful API design for efficient client-server communication</li>
                        <li>Responsive design ensuring great user experience across all devices</li>
                        <li>Security best practices including proper authentication and data validation</li>
                        <li>Component-based architecture for reusable and modular code</li>
                    </ul>

                    <h3>Challenges & Solutions</h3>
                    <div class="challenges-grid">
                        <div class="challenge-card">
                            <h4>🔐 Authentication & Session Management</h4>
                            <p>
                                <strong>Challenge:</strong> Implementing secure user authentication while maintaining a
                                smooth user experience.
                            </p>
                            <p>
                                <strong>Solution:</strong> Implemented JWT-based authentication with secure cookie
                                storage and proper session management,
                                ensuring users stay logged in across page refreshes while maintaining security.
                            </p>
                        </div>
                        <div class="challenge-card">
                            <h4>🔍 Complex Search Functionality</h4>
                            <p>
                                <strong>Challenge:</strong> Creating an efficient search system that handles multiple
                                filters and large datasets.
                            </p>
                            <p>
                                <strong>Solution:</strong> Designed optimized database queries and implemented
                                intelligent caching strategies
                                to ensure fast search results even with complex filter combinations.
                            </p>
                        </div>
                        <div class="challenge-card">
                            <h4>📱 Responsive Design</h4>
                            <p>
                                <strong>Challenge:</strong> Ensuring the website looks and functions perfectly on all
                                screen sizes.
                            </p>
                            <p>
                                <strong>Solution:</strong> Utilized CSS Grid and Flexbox layouts combined with
                                Bootstrap's responsive utilities
                                to create a fluid, adaptive design that works seamlessly from mobile to desktop.
                            </p>
                        </div>
                        <div class="challenge-card">
                            <h4>🗄️ Database Design</h4>
                            <p>
                                <strong>Challenge:</strong> Designing a database schema that efficiently handles
                                recipes, users, and their relationships.
                            </p>
                            <p>
                                <strong>Solution:</strong> Created a normalized database structure with proper indexing
                                and relationships,
                                enabling efficient queries while maintaining data integrity.
                            </p>
                        </div>
                    </div>

                    <h3>What We Learned</h3>
                    <p>
                        This project has been an incredible learning journey. We've gained hands-on experience with:
                    </p>
                    <ul>
                        <li>Full-stack web development from conception to deployment</li>
                        <li>Working with external APIs and handling asynchronous operations</li>
                        <li>Database design and optimization techniques</li>
                        <li>User experience design principles and responsive web design</li>
                        <li>Team collaboration using Git and modern development workflows</li>
                        <li>Problem-solving and debugging complex issues in a full-stack environment</li>
                        <li>The importance of clean code, documentation, and testing</li>
                    </ul>

                    <p class="conclusion">
                        Building Granny's Recipes has not only strengthened our technical skills but also taught us the
                        importance of user-centered design and the value of creating applications that bring joy and
                        utility to people's daily lives. We're proud of what we've built and excited to continue
                        improving and expanding the platform.
                    </p>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AboutPage',
    mounted() {
        // Scroll to top when component is mounted
        window.scrollTo(0, 0);
    }
};
</script>

<style scoped>
.about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background: linear-gradient(to bottom, #faf8f3, #ffffff);
    min-height: 100vh;
}

/* Header */
.about-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
    border-bottom: 3px double #d4a574;
}

.about-title {
    font-family: 'Georgia', serif;
    font-size: 2.5rem;
    color: #5c4033;
    margin-bottom: 1rem;
}

.about-subtitle {
    font-size: 1.2rem;
    color: #6b5d54;
    font-style: italic;
}

/* Content */
.about-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

/* Sections */
.about-section {
    background: white;
    border-radius: 12px;
    padding: 2.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e8dfd6;
}

.section-icon {
    font-size: 3rem;
    text-align: center;
    margin-bottom: 1rem;
}

.section-title {
    font-family: 'Georgia', serif;
    font-size: 2rem;
    color: #5c4033;
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #d4a574;
}

.section-content h3 {
    font-family: 'Georgia', serif;
    color: #5c4033;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.4rem;
}

.section-content p {
    color: #6b5d54;
    line-height: 1.8;
    margin-bottom: 1rem;
}

.section-content ul {
    color: #6b5d54;
    line-height: 1.8;
    padding-left: 1.5rem;
}

.section-content ul li {
    margin-bottom: 0.75rem;
}

/* Developers Section */
.developers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.developer-card {
    background: #faf8f3;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #d4a574;
}

.developer-card h3 {
    font-family: 'Georgia', serif;
    color: #5c4033;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
}

.developer-role {
    color: #8b7355;
    font-weight: 600;
    margin-bottom: 1rem;
    font-style: italic;
}

.developer-bio {
    color: #6b5d54;
    line-height: 1.6;
}

.team-statement {
    text-align: center;
    padding: 1.5rem;
    background: #faf8f3;
    border-radius: 8px;
    margin-top: 1rem;
}

.team-statement p {
    color: #6b5d54;
    font-style: italic;
    margin: 0;
}

/* Features List */
.features-list {
    list-style: none;
    padding: 0;
}

.features-list li {
    background: #faf8f3;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    border-left: 3px solid #d4a574;
}

.features-list strong {
    color: #5c4033;
}

/* Technology Grid */
.tech-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1rem;
}

.tech-category {
    background: #faf8f3;
    padding: 1.5rem;
    border-radius: 8px;
}

.tech-category h4 {
    color: #5c4033;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    border-bottom: 2px solid #d4a574;
    padding-bottom: 0.5rem;
}

.tech-category ul {
    list-style: none;
    padding: 0;
}

.tech-category li {
    margin-bottom: 0.5rem;
}

/* Challenges Grid */
.challenges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.challenge-card {
    background: linear-gradient(135deg, #faf8f3 0%, #f5e6d3 100%);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e8dfd6;
}

.challenge-card h4 {
    color: #5c4033;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.challenge-card p {
    color: #6b5d54;
    line-height: 1.6;
    margin-bottom: 0.75rem;
}

.challenge-card p strong {
    color: #5c4033;
}

/* Conclusion */
.conclusion {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #faf8f3;
    border-radius: 8px;
    border: 1px solid #d4a574;
    font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
    .about-container {
        padding: 1rem;
    }

    .about-section {
        padding: 1.5rem;
    }

    .about-title {
        font-size: 2rem;
    }

    .section-title {
        font-size: 1.5rem;
    }

    .developers-grid,
    .tech-grid,
    .challenges-grid {
        grid-template-columns: 1fr;
    }
}
</style>