import moment from 'moment';
import request from 'supertest';

describe('POST /generateReport', () => {
  it('should generate a report', async () => {
    const from = moment().subtract(1, 'day').toDate();
    const to = moment().toDate();
    const address = '0x299b366E0C65736bD6a8dA5943DF21148713ab75';

    const response = await request('http://localhost:3001').post('/generateReport').send({ from, to, address });
    expect(response.status).toBe(200); // or whatever status code you expect
  });
});
