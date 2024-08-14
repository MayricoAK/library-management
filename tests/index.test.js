const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');

const req = request(app);

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Library System', () => {
    beforeAll(async () => {
        // Setup data buku dan anggota sebelum test dijalankan
        await request(app).post('/books').send({ code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 });
        await request(app).post('/books').send({ code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 });
        await request(app).post('/books').send({ code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1 });
        await request(app).post('/books').send({ code: 'HOB-83', title: 'The Hobbit, or There and Back Again', author: 'J.R.R. Tolkien', stock: 1 });
        await request(app).post('/books').send({ code: 'NRN-7', title: 'The Lion, the Witch and the Wardrobe', author: 'C.S. Lewis', stock: 1 });

        await request(app).post('/members').send({ code: 'M001', name: 'Angga' });
        await request(app).post('/members').send({ code: 'M002', name: 'Ferry' });
        await request(app).post('/members').send({ code: 'M003', name: 'Putri' });
    });

    afterAll(async () => {
        // Cleanup data buku dan anggota setelah test selesai
        await request(app).delete('/books').send({ code: 'JK-45' });
        await request(app).delete('/books').send({ code: 'SHR-1' });
        await request(app).delete('/books').send({ code: 'TW-11' });
        await request(app).delete('/books').send({ code: 'HOB-83' });
        await request(app).delete('/books').send({ code: 'NRN-7' });

        await request(app).delete('/members').send({ code: 'M001' });
        await request(app).delete('/members').send({ code: 'M002' });
        await request(app).delete('/members').send({ code: 'M003' });
    });

    it('should allow a member to borrow a book if they have not exceeded the limit of 2 books', async () => {
        // Act: Borrow the first book
        const res1 = await request(app).post('/books/borrow').send({
            memberCode: 'M001',
            bookCode: 'JK-45',
            borrowedDate: '01-08-2024'
        });
        expect(res1.statusCode).toEqual(200);

        // Act: Borrow the second book
        const res2 = await request(app).post('/books/borrow').send({
            memberCode: 'M001',
            bookCode: 'SHR-1',
            borrowedDate: '02-08-2024'
        });
        expect(res2.statusCode).toEqual(200);

        // Act: Try to borrow a third book
        const res3 = await request(app).post('/books/borrow').send({
            memberCode: 'M001',
            bookCode: 'TW-11',
            borrowedDate: '03-08-2024'
        });
        expect(res3.statusCode).toEqual(400); // Expect failure as the member has already borrowed 2 books
        expect(res3.body.message).toContain('Cannot borrow more than 2 books');
    });

    it('should not allow borrowing a book that is already borrowed by another member', async () => {
        // Act: Member M001 borrows the book
        await request(app).post('/books/borrow').send({
            memberCode: 'M001',
            bookCode: 'JK-45',
            borrowedDate: '01-08-2024'
        });

        // Act: Attempt to borrow the same book with another member
        const res = await request(app).post('/books/borrow').send({
            memberCode: 'M002',
            bookCode: 'JK-45',
            borrowedDate: '05-08-2024'
        });
        expect(res.statusCode).toEqual(400); // Expect failure as the book is already borrowed
        expect(res.body.message).toContain('Book is not available');
    });

    it('should not allow borrowing if the member is currently penalized', async () => {
        // Act: Apply a penalty to member M001
        await request(app).patch('/members/penalty').send({
            memberCode: 'M001',
            penaltyEndDate: '2024-08-13'
        });

        // Act: Try to borrow a book with the penalized member
        const res = await request(app).post('/books/borrow').send({
            memberCode: 'M001',
            bookCode: 'JK-45',
            borrowedDate: '11-08-2024'
        });
        expect(res.statusCode).toEqual(400); // Expect failure due to penalty
        expect(res.body.message).toContain('Member is currently penalized');
    });

    it('should prevent borrowing if a member has an active penalty', async () => {
        // Act: Apply a penalty to member M001
        await request(app).patch('/members/penalty').send({
            memberCode: 'M001',
            penaltyEndDate: '2024-08-13'
        });

        // Act: Attempt to borrow a book with the penalized member
        const res = await request(app).post('/books/borrow').send({
            memberCode: 'M001',
            bookCode: 'SHR-1',
            borrowedDate: '12-08-2024'
        });
        expect(res.statusCode).toEqual(400); // Expect failure due to penalty
        expect(res.body.message).toContain('Member is currently penalized');
    });

    it('should show all existing books and their quantities', async () => {
        // Act: Retrieve all books
        const res = await request(app).get('/books');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(5); // Adjust based on the setup
    });

    it('should show all existing members', async () => {
        // Act: Retrieve all members
        const res = await request(app).get('/members');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveLength(3); // Adjust based on the setup
    });
});

