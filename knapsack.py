from itertools import product

@app.route('/menu', methods=['POST', 'GET'])
def menu():
    if request.method == 'POST':
        meals = body['meals']
        target_kcal = int(body['kcal'])

        combinations = []
        if user.is_vegan:
            combinations = list(product(*[Recipe.query.filter_by(
                type=type_of_meal, for_vegan=user.is_vegan).all() for type_of_meal in meals]))
        elif user.is_vegetarian:
            combinations = list(product(*[Recipe.query.filter_by(
                type=type_of_meal, for_vegetarian=user.is_vegetarian).all() for type_of_meal in meals]))
        else:
            combinations = list(product(*[Recipe.query.filter_by(
                type=type_of_meal).all() for type_of_meal in meals]))
        
        current_best = tuple()
        current_best_kcal = 0

        for combination in combinations:
            kcal = 0
            for recipe in combination:
                kcal += recipe.kcal
            if abs(current_best_kcal - target_kcal) > abs(kcal - target_kcal):
                current_best = combination
                current_best_kcal = kcal

        menu = Menu.query.filter_by(kcal=current_best_kcal).first()

        if menu:
            return menu 
        else:
            return current_best