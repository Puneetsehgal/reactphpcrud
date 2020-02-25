import { render } from 'react-dom';
import routes from 'routes.js'; // placeholder page

class AppInitializer {

    run() {
        render(
            routes
            , document.getElementById('app')
        );
    }
}

new AppInitializer().run();

