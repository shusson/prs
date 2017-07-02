import { DashboardPage } from './app.po';

describe('dashboard App', () => {
  let page: DashboardPage;

  beforeEach(() => {
    page = new DashboardPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
