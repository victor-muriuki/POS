from .extensions import db
from .models import Supplier, Item

def seed_data():
    # Create suppliers
    supplier1 = Supplier(name="Textbook Centre", contact="0720000001", email="info@textbookcentre.co.ke")
    supplier2 = Supplier(name="Soma Publishers", contact="0720000002", email="support@soma.co.ke")
    supplier3 = Supplier(name="StarBooks Distributors", contact="0720000003", email="sales@starbooks.com")
    supplier4 = Supplier(name="Nairobi Book Supply", contact="0720000004", email="orders@nairobi-books.com")
    supplier5 = Supplier(name="Learning Hub Ltd", contact="0720000005", email="hello@learninghub.co.ke")

    db.session.add_all([supplier1, supplier2, supplier3, supplier4, supplier5])
    db.session.commit()

    # Book items with each supplier supplying multiple items
    items = [
        Item(name="Mathematics Form 1", quantity=30, buying_price=350, selling_price=500, supplier=supplier1),
        Item(name="Mathematics Form 2", quantity=25, buying_price=360, selling_price=520, supplier=supplier1),
        Item(name="Mathematics Form 3", quantity=20, buying_price=370, selling_price=530, supplier=supplier1),
        Item(name="Mathematics Form 4", quantity=18, buying_price=380, selling_price=540, supplier=supplier1),
        Item(name="Chemistry Form 1", quantity=22, buying_price=400, selling_price=580, supplier=supplier1),
        Item(name="Chemistry Form 2", quantity=20, buying_price=420, selling_price=600, supplier=supplier1),
        Item(name="English Literature - Blossoms", quantity=15, buying_price=450, selling_price=700, supplier=supplier2),
        Item(name="English Grammar Workbook", quantity=40, buying_price=200, selling_price=350, supplier=supplier2),
        Item(name="Set Book Guide - A Doll’s House", quantity=35, buying_price=250, selling_price=400, supplier=supplier2),
        Item(name="Kiswahili Fasihi - Kigogo", quantity=30, buying_price=220, selling_price=350, supplier=supplier2),
        Item(name="Kiswahili Sarufi", quantity=28, buying_price=210, selling_price=320, supplier=supplier2),
        Item(name="Biology Form 1", quantity=25, buying_price=390, selling_price=560, supplier=supplier3),
        Item(name="Biology Form 2", quantity=20, buying_price=400, selling_price=580, supplier=supplier3),
        Item(name="Physics Form 1", quantity=18, buying_price=410, selling_price=600, supplier=supplier3),
        Item(name="Physics Form 2", quantity=15, buying_price=430, selling_price=620, supplier=supplier3),
        Item(name="Geography Form 1", quantity=19, buying_price=310, selling_price=460, supplier=supplier3),
        Item(name="Geography Form 2", quantity=17, buying_price=320, selling_price=470, supplier=supplier3),
        Item(name="CRE Form 1", quantity=16, buying_price=290, selling_price=420, supplier=supplier4),
        Item(name="CRE Form 2", quantity=15, buying_price=300, selling_price=430, supplier=supplier4),
        Item(name="History Form 1", quantity=14, buying_price=305, selling_price=450, supplier=supplier4),
        Item(name="History Form 2", quantity=12, buying_price=315, selling_price=460, supplier=supplier4),
        Item(name="Business Studies Form 1", quantity=20, buying_price=280, selling_price=410, supplier=supplier4),
        Item(name="Business Studies Form 2", quantity=18, buying_price=290, selling_price=420, supplier=supplier4),
        Item(name="Computer Studies Form 1", quantity=22, buying_price=330, selling_price=470, supplier=supplier5),
        Item(name="Computer Studies Form 2", quantity=20, buying_price=340, selling_price=480, supplier=supplier5),
        Item(name="Computer Studies Form 3", quantity=18, buying_price=350, selling_price=490, supplier=supplier5),
        Item(name="Computer Studies Form 4", quantity=16, buying_price=360, selling_price=500, supplier=supplier5),
        Item(name="English Oral Skills", quantity=25, buying_price=280, selling_price=410, supplier=supplier2),
        Item(name="Kiswahili Insha", quantity=23, buying_price=260, selling_price=390, supplier=supplier2),
        Item(name="Science Dictionary", quantity=30, buying_price=230, selling_price=350, supplier=supplier3),
        Item(name="Revision Book - Chemistry", quantity=32, buying_price=240, selling_price=370, supplier=supplier1),
        Item(name="Revision Book - Biology", quantity=29, buying_price=250, selling_price=380, supplier=supplier3),
        Item(name="Revision Book - Math", quantity=27, buying_price=260, selling_price=390, supplier=supplier1),
        Item(name="Revision Book - Physics", quantity=24, buying_price=270, selling_price=400, supplier=supplier1),
        Item(name="Storybook - The River and The Source", quantity=40, buying_price=320, selling_price=480, supplier=supplier2),
        Item(name="Set Book Guide - Fathers of Nations", quantity=33, buying_price=280, selling_price=450, supplier=supplier2),
        Item(name="Student Atlas", quantity=20, buying_price=450, selling_price=650, supplier=supplier4),
        Item(name="Mathematics Formula Booklet", quantity=35, buying_price=150, selling_price=250, supplier=supplier1),
        Item(name="Past KCSE Papers - Sciences", quantity=30, buying_price=200, selling_price=300, supplier=supplier3),
        Item(name="Past KCSE Papers - Humanities", quantity=30, buying_price=200, selling_price=300, supplier=supplier4),
    ]

    db.session.add_all(items)
    db.session.commit()
    print("Seeded 40 bookshop items with suppliers.")
