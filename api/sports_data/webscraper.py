import random
import time
from abc import ABC, abstractmethod

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager


class Webscraper(ABC):
    def __init__(self, url):
        self.url = url
        options = Options()
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")
        self.driver = webdriver.Chrome(ChromeDriverManager("114.0.5735.90").install(), chrome_options=options)
        self.wait = WebDriverWait(self.driver, 10)

    def load_page(self):
        self.driver.get(self.url)
        time.sleep(random.uniform(2, 10))  # Add delay

    def get_table_html(self, css_selector):
        table = self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, css_selector)))
        return table.get_attribute('innerHTML')

    def get_soup(self, html):
        return BeautifulSoup(html, "html.parser")

    @abstractmethod
    def scrape(self):
        pass

    def quit(self):
        self.driver.quit()
