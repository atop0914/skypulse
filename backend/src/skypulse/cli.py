"""CLI 终端测试界面"""


def main():
    print("Weather Bot CLI")
    print("Type 'exit' to quit.")
    while True:
        try:
            user_input = input("> ")
            if user_input.lower() in ["exit", "quit"]:
                print("Goodbye!")
                break
            print(f"Processing: {user_input}")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except EOFError:
            break


if __name__ == "__main__":
    main()
