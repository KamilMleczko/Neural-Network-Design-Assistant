# UV package manager:

- to add dependency run :
``` uv add [package name]```

- to copy the behaviour of ```pip install package_name[standard]``` run: \
``` uv add package_name --extra standard```

# to log in to hugging face (acces tokenizers) run:
hf auth login

# Ruff linter
For quick lint + fix + format run:  \
``` make lint-format``` 

More commands are present inside `Makefile`