const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const gameOverMessage = document.getElementById('gameOverMessage');

        canvas.width = 500;
        canvas.height = 600;

        let frogSize = 30;
        let frogX = canvas.width / 2 - frogSize / 2;
        let frogY = canvas.height - frogSize;
        const frogSpeed = 5;
        let frogVelocityX = 0;
        let frogVelocityY = 0;

        let cars = [];
        const carSize = 50; // Square cars
        let baseCarSpeed = 3;

        let isGameOver = false;
        let score = 0;

        let keys = {
            ArrowLeft: false,
            ArrowRight: false,
            ArrowUp: false,
            ArrowDown: false
        };

        function drawFrog() {
            ctx.fillStyle = 'green';
            ctx.fillRect(frogX, frogY, frogSize, frogSize);
        }

        function drawCar(car) {
            ctx.fillStyle = 'red';
            ctx.fillRect(car.x, car.y, carSize, carSize); // Square cars
        }

        function moveFrog() {
            // Apply movement based on key presses
            if (keys.ArrowLeft && frogX > 0) frogVelocityX = -frogSpeed;
            if (keys.ArrowRight && frogX < canvas.width - frogSize) frogVelocityX = frogSpeed;
            if (keys.ArrowUp && frogY > 0) frogVelocityY = -frogSpeed;
            if (keys.ArrowDown && frogY < canvas.height - frogSize) frogVelocityY = frogSpeed;

            // Update frog's position
            frogX += frogVelocityX;
            frogY += frogVelocityY;

            // Apply friction to smooth movement
            frogVelocityX *= 0.9;
            frogVelocityY *= 0.9;

            // Ensure the frog stays within the boundaries of the canvas
            if (frogX < 0) frogX = 0;
            if (frogX > canvas.width - frogSize) frogX = canvas.width - frogSize;
            if (frogY < 0) frogY = 0;
            if (frogY > canvas.height - frogSize) frogY = canvas.height - frogSize;

            // Reset frog position and progress score if it reaches the top
            if (frogY <= 0) {
                score++;
                resetFrog();
                addMoreCars();
                increaseDifficulty();
            }
        }

        function resetFrog() {
            frogX = canvas.width / 2 - frogSize / 2;
            frogY = canvas.height - frogSize;
        }

        function addMoreCars() {
            for (let i = 0; i < 2; i++) {
                cars.push({
                    x: Math.random() * (canvas.width - carSize),
                    y: -carSize,
                    speed: baseCarSpeed + Math.random() * 3,
                    direction: Math.random() < 0.5 ? 1 : -1
                });
            }
        }

        function moveCars() {
            cars.forEach(car => {
                car.y += car.speed;
                car.x += car.direction * Math.random();

                if (car.y > canvas.height) {
                    car.y = -carSize;
                    car.x = Math.random() * (canvas.width - carSize);
                    car.speed = baseCarSpeed + Math.random() * 3;
                }

                if (car.x < 0 || car.x > canvas.width - carSize) {
                    car.direction *= -1;
                }
            });
        }

        function increaseDifficulty() {
            frogSize = Math.max(20, frogSize - 2);
            baseCarSpeed += 0.5;
        }

        function checkCollision() {
            for (let car of cars) {
                if (frogX < car.x + carSize &&
                    frogX + frogSize > car.x &&
                    frogY < car.y + carSize &&
                    frogY + frogSize > car.y) {
                    gameOver();
                }
            }
        }

        function gameOver() {
            isGameOver = true;
            gameOverMessage.style.display = 'block';
        }

        function restartGame() {
            isGameOver = false;
            gameOverMessage.style.display = 'none';
            frogSize = 30;
            baseCarSpeed = 3;
            score = 0;
            cars = [];
            resetFrog();
            for (let i = 0; i < 4; i++) addMoreCars();
            updateGame();
        }

        function updateGame() {
            if (isGameOver) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawFrog();
            cars.forEach(drawCar);
            moveCars();
            moveFrog();
            checkCollision();

            requestAnimationFrame(updateGame);
        }

        document.addEventListener('keydown', (e) => {
            keys[e.key] = true;

            // Restart game when spacebar is pressed and game is over
            if (isGameOver && e.key === ' ') {
                restartGame();
            }
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });

        // Initialize game
        for (let i = 0; i < 4; i++) addMoreCars();
        updateGame();