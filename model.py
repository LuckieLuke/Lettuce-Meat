class Menu_recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    menu_id = db.Column(db.Integer, nullable=False, unique=False)
    recipe_id = db.Column(db.Integer, nullable=False)

    def __init__(self, menu_id, recipe_id):
        self.menu_id = menu_id
        self.recipe_id = recipe_id