var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () =>
{
    return new
    {
        Variable = app.Configuration.GetValue<string>("Variable"),
        VariableInObject = new
        {
            Key = app.Configuration.GetValue<string>("VariableInObject:Key")
        }
    };
});

app.Run();
